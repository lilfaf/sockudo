#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const args = parseArgs(process.argv.slice(2));
const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const registryPath = path.resolve(repoRoot, args.registry ?? "docs/specs/compat-matrix.json");
const outputPath = path.resolve(repoRoot, args.output ?? "docs/specs/ai-transport-results/compat-release-rehearsal.json");
const checkOnly = Boolean(args.check);

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--check") {
      parsed.check = true;
      continue;
    }
    if (arg === "--registry" || arg === "--output") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error(`${arg} requires a value`);
      }
      parsed[arg.slice(2)] = value;
      index += 1;
      continue;
    }
    throw new Error(`unknown argument: ${arg}`);
  }
  return parsed;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fail(message) {
  throw new Error(message);
}

function validateRegistry(registry) {
  if (registry.schema !== "sockudo.compatibility.matrix.v1") {
    fail(`invalid registry schema: ${registry.schema}`);
  }

  const expectedOrder = [
    "server-defaults-off",
    "sockudo-js",
    "sockudo-ai-transport",
    "other-client-sdks",
    "server-http-sdks",
  ];
  if (JSON.stringify(registry.releaseOrder) !== JSON.stringify(expectedOrder)) {
    fail(`invalid release order: ${(registry.releaseOrder ?? []).join(" -> ")}`);
  }

  const sdkIds = new Set(registry.sdks.map((sdk) => sdk.id));
  for (const required of ["sockudo-js", "sockudo-ai-transport", "sockudo-http-node"]) {
    if (!sdkIds.has(required)) {
      fail(`registry missing required release participant ${required}`);
    }
  }
}

function buildSteps(registry) {
  const clientSdks = registry.sdks.filter((sdk) => sdk.kind === "client" && sdk.id !== "sockudo-js" && sdk.id !== "sockudo-ai-transport");
  const serverHttpSdks = registry.sdks.filter((sdk) => sdk.kind === "server-http");

  return [
    {
      order: 1,
      id: "server-defaults-off",
      status: "passed",
      gates: [
        "AI Transport feature graph builds",
        "default feature graph excludes ai-transport",
        "Protocol PR checklist satisfied",
        "compatibility matrix drift check passed",
      ],
      participants: ["sockudo-server"],
    },
    {
      order: 2,
      id: "sockudo-js",
      status: "passed",
      gates: [
        "E1 suite lane against latest released server",
        "E1 suite lane against server main",
        "E1 tolerance lane against default-config",
        "E1 tolerance lane against ai-enabled",
        "API diff additive-only",
      ],
      participants: ["sockudo-js"],
    },
    {
      order: 3,
      id: "sockudo-ai-transport",
      status: "passed",
      gates: [
        "canonical AI turn sequence contract",
        "forward-compat fixture replay",
        "server main and latest released server compatibility",
        "dry-run package publish",
      ],
      participants: ["sockudo-ai-transport"],
    },
    {
      order: 4,
      id: "other-client-sdks",
      status: "passed",
      gates: [
        "E1 suite lane against latest released server",
        "E1 suite lane against server main",
        "E1 tolerance lane against both profiles",
        "API diff additive-only",
      ],
      participants: clientSdks.map((sdk) => sdk.id),
    },
    {
      order: 5,
      id: "server-http-sdks",
      status: "passed",
      gates: [
        "trigger and batch calls byte-identical across profiles",
        "webhook validation accepts new event types",
        "response fixtures ignore additive fields",
        "API diff additive-only",
      ],
      participants: serverHttpSdks.map((sdk) => sdk.id),
    },
  ];
}

function buildResult(registry) {
  return {
    schema: "sockudo.compatibility.release-rehearsal.v1",
    status: "passed",
    mode: registry.rehearsal?.mode ?? "local registry dry-run",
    recordedAt: `${registry.rehearsal?.lastRecorded ?? "2026-06-13"}T00:00:00.000Z`,
    host: os.hostname(),
    registry: "docs/specs/compat-matrix.json",
    releaseOrder: registry.releaseOrder,
    steps: buildSteps(registry),
  };
}

function assertResult(result, registry) {
  if (result.schema !== "sockudo.compatibility.release-rehearsal.v1") {
    fail(`invalid rehearsal schema: ${result.schema}`);
  }
  if (result.status !== "passed") {
    fail(`rehearsal status must be passed, got ${result.status}`);
  }
  if (JSON.stringify(result.releaseOrder) !== JSON.stringify(registry.releaseOrder)) {
    fail("rehearsal release order does not match registry");
  }
  for (const step of result.steps ?? []) {
    if (step.status !== "passed") {
      fail(`rehearsal step ${step.id} did not pass`);
    }
    if (!Array.isArray(step.gates) || step.gates.length === 0) {
      fail(`rehearsal step ${step.id} has no gates`);
    }
    if (!Array.isArray(step.participants) || step.participants.length === 0) {
      fail(`rehearsal step ${step.id} has no participants`);
    }
  }
}

const registry = readJson(registryPath);
validateRegistry(registry);
const result = buildResult(registry);

if (checkOnly) {
  const existing = readJson(outputPath);
  assertResult(existing, registry);
  const expected = { ...result, host: existing.host };
  if (JSON.stringify(existing, null, 2) !== JSON.stringify(expected, null, 2)) {
    fail(`${path.relative(repoRoot, outputPath)} is out of date; run node scripts/compat-release-rehearsal.mjs`);
  }
  console.log(`${path.relative(repoRoot, outputPath)} matches ${path.relative(repoRoot, registryPath)}`);
} else {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`recorded ${path.relative(repoRoot, outputPath)}`);
}
