# SDK Ecosystem Audit And Compatibility Baseline

Generated: 2026-06-27 11:46:02 +03:00.

Baseline server SHA: `1d3f871a911487ffffef5057dd83be3d63a56418`.

Important qualifier: the checkout was dirty before this audit began. The baseline below records the
observed local workspace at that SHA, not a pristine main-branch checkout. No SDK production code
was changed as part of this audit.

Machine-readable artifact: `docs/specs/sdk-ecosystem-baseline.json`.

## Summary

- The in-tree ecosystem is 7 client packages and 9 server HTTP SDKs, not 5 client SDKs.
- No SDK directories are git submodules in this checkout. They are imported package directories
  governed by root workflows such as `.github/workflows/sdk-ci.yml`.
- Baseline suite status: 11 green suites, 1 repository-level red suite, 4 local/tooling-blocked
  suites, and 1 third-party V1 canary failure.
- Filed issues:
  - https://github.com/sockudo/sockudo/issues/297 for the PHP server SDK PHPUnit warning exit.
  - https://github.com/sockudo/sockudo/issues/298 for vanilla Pusher publish-to-deliver canary
    failure.
- The highest-risk additive-change breakpoints are strict webhook parsers in the Swift server SDK,
  Python server SDK, Rust server SDK, and .NET server SDK, plus 64-bit serial/extras loss in
  several realtime clients.

## Inventory

Published versions were checked against the public registries on 2026-06-27. CI setup is rooted in
`.github/workflows/sdk-ci.yml`, with release lanes in `.github/workflows/sdk-release.yml`.

### Client Packages

| SDK | Package id and published version | Local metadata | Toolchain and runtime targets | Repo and CI status | Baseline commands |
|---|---|---|---|---|---|
| `client-sdks/sockudo-js` | npm `@sockudo/client` 2.0.0 | `client-sdks/sockudo-js/package.json:2`, `client-sdks/sockudo-js/package.json:3` | TypeScript, Bun, Node `>=22`, browser, Node, worker, React, Vue, React Native, NativeScript | Imported directory, no submodule; root CI matrix at `.github/workflows/sdk-ci.yml:83` | `bun install --frozen-lockfile`; `bun run lint`; `bun run build`; `bun run typecheck`; `bun test` |
| `client-sdks/sockudo-ai-transport-js` | npm `@sockudo/ai-transport` 2.0.0 | `client-sdks/sockudo-ai-transport-js/package.json:2`, `client-sdks/sockudo-ai-transport-js/package.json:3` | TypeScript, pnpm 10.17.0, Node `>=20`, framework subpaths for React, Vue, Svelte, Vercel AI SDK | Imported directory, no submodule; root CI matrix at `.github/workflows/sdk-ci.yml:93` | `pnpm lint`; `pnpm typecheck`; `pnpm test`; `pnpm build`; release gate in package scripts |
| `client-sdks/sockudo-python` | PyPI `sockudo-python` 2.0.0 | `client-sdks/sockudo-python/pyproject.toml:6`, `client-sdks/sockudo-python/pyproject.toml:10` | Python `>=3.10`, asyncio/websockets, httpx | Imported directory, no submodule; root CI matrix at `.github/workflows/sdk-ci.yml:174` | `python -m pip install -e .[dev]`; `ruff check .`; `python -m pytest` |
| `client-sdks/sockudo-dotnet` | NuGet `Sockudo.Client` 2.0.0 | `client-sdks/sockudo-dotnet/src/Sockudo.Client/Sockudo.Client.csproj` | .NET, browser/server capable WebSocket client | Imported directory, no submodule; root CI matrix at `.github/workflows/sdk-ci.yml:245` | `dotnet restore`; `dotnet build --configuration Release`; `dotnet test tests/Sockudo.Client.Tests/Sockudo.Client.Tests.csproj --configuration Release` |
| `client-sdks/sockudo-flutter` | pub.dev `sockudo_flutter` 2.0.0 | `client-sdks/sockudo-flutter/pubspec.yaml:1`, `client-sdks/sockudo-flutter/pubspec.yaml:3` | Dart/Flutter, Android, iOS, web, desktop depending on Flutter targets | Imported directory, no submodule; root CI at `.github/workflows/sdk-ci.yml:217` | `flutter pub get`; `dart format --set-exit-if-changed .`; `flutter analyze`; `flutter test` |
| `client-sdks/sockudo-kotlin` | Maven `io.sockudo:sockudo-kotlin` 2.0.0 | `client-sdks/sockudo-kotlin/lib/build.gradle.kts:11`, `client-sdks/sockudo-kotlin/lib/build.gradle.kts:12` | Kotlin/JVM, OkHttp/Kotlinx serialization | Imported directory, no submodule; root CI at `.github/workflows/sdk-ci.yml:314` | `./gradlew --no-daemon :lib:check`; `./gradlew --no-daemon :lib:test` |
| `client-sdks/sockudo-swift` | SwiftPM `SockudoSwift`, no registry version endpoint | `client-sdks/sockudo-swift/Package.swift:1`, `client-sdks/sockudo-swift/Package.swift:7` | Swift 6.2 package, iOS 13, macOS 10.15, tvOS 13, watchOS 6, visionOS 1 | Imported directory, no submodule; root CI at `.github/workflows/sdk-ci.yml:348` | `swift format lint --recursive Sources Tests`; `swiftlint lint --strict`; `swift test` |

### Server HTTP SDKs

| SDK | Package id and published version | Local metadata | Toolchain and runtime targets | Repo and CI status | Baseline commands |
|---|---|---|---|---|---|
| `server-sdks/sockudo-http-node` | npm `sockudo` 2.0.0 | `server-sdks/sockudo-http-node/package.json:2`, `server-sdks/sockudo-http-node/package.json:3` | TypeScript/Node HTTP server SDK | Imported directory, no submodule; root CI at `.github/workflows/sdk-ci.yml:75` | `npm install`; `npm run local-test` |
| `server-sdks/sockudo-http-python` | PyPI `sockudo-http-python` 2.0.0 | `server-sdks/sockudo-http-python/pyproject.toml:6`, `server-sdks/sockudo-http-python/pyproject.toml:10` | Python `>=3.9`, httpx/PyNaCl | Imported directory, no submodule; root CI at `.github/workflows/sdk-ci.yml:166` | `python -m pip install -e .[dev]`; `ruff check .`; `python -m pytest` |
| `server-sdks/sockudo-http-dotnet` | NuGet `SockudoServer` 2.0.0 | `server-sdks/sockudo-http-dotnet/SockudoServer/SockudoServer.csproj` | .NET server SDK, plus Pusher-compatible solution | Imported directory, no submodule; root CI at `.github/workflows/sdk-ci.yml:236` | `dotnet test sockudo-dotnet-server.sln`; `dotnet test pusher-dotnet-server.sln` |
| `server-sdks/sockudo-http-go` | Go module `github.com/sockudo/sockudo/server-sdks/sockudo-http-go/v2` v2.0.0 | `server-sdks/sockudo-http-go/go.mod:1`, `server-sdks/sockudo-http-go/go.mod:3` | Go HTTP server SDK | Imported directory, no submodule; root CI at `.github/workflows/sdk-ci.yml:425` | `go test ./...` |
| `server-sdks/sockudo-http-java` | Maven `io.sockudo:sockudo-http-java` 2.0.0 | `server-sdks/sockudo-http-java/build.gradle:26`, `server-sdks/sockudo-http-java/build.gradle:94` | Java 17-compatible library | Imported directory, no submodule; root CI at `.github/workflows/sdk-ci.yml:306` | `./gradlew --no-daemon test` |
| `server-sdks/sockudo-http-php` | Packagist `sockudo/sockudo-php-server` v2.0.0 | `server-sdks/sockudo-http-php/composer.json:2` | PHP `^8.2` HTTP server SDK | Imported directory, no submodule; root CI at `.github/workflows/sdk-ci.yml:370` | `composer install --no-interaction --prefer-dist`; `vendor/bin/phpunit` |
| `server-sdks/sockudo-http-ruby` | RubyGems `sockudo` 2.0.1, local gemspec 2.0.0 | `server-sdks/sockudo-http-ruby/sockudo.gemspec:6`, `server-sdks/sockudo-http-ruby/sockudo.gemspec:16` | Ruby HTTP server SDK | Imported directory, no submodule; root CI at `.github/workflows/sdk-ci.yml:398` | `bundle install`; `bundle exec rake spec` |
| `server-sdks/sockudo-http-rust` | crates.io `sockudo-http` 2.0.0 | `server-sdks/sockudo-http-rust/Cargo.toml:2`, `server-sdks/sockudo-http-rust/Cargo.toml:3` | Rust HTTP server SDK | Imported directory, no submodule; root CI at `.github/workflows/sdk-ci.yml:449` | `cargo test --all-features` |
| `server-sdks/sockudo-http-swift` | SwiftPM `Sockudo`, no registry version endpoint | `server-sdks/sockudo-http-swift/Package.swift:1`, `server-sdks/sockudo-http-swift/Package.swift:10` | Swift server SDK | Imported directory, no submodule; root CI at `.github/workflows/sdk-ci.yml:340` | `swift format lint --recursive Sources Tests`; `swiftlint lint --strict`; `swift test` |

## Client Protocol Coverage

| Client SDK | Implemented protocol surface | Missing or risky for U1-U7 |
|---|---|---|
| `@sockudo/client` | V1/V2 prefix handling in `client-sdks/sockudo-js/src/core/protocol_prefix.ts`; connection options in `client-sdks/sockudo-js/src/core/options.ts:26`; channel history params/page in `client-sdks/sockudo-js/src/core/channels/channel.ts:30` and `client-sdks/sockudo-js/src/core/channels/channel.ts:247`; consume-side mutable-message reducer in `client-sdks/sockudo-js/src/core/versioned_messages.ts:44`; presence add/remove in `client-sdks/sockudo-js/src/core/channels/presence_channel.ts:101`; push proxy support exists under package subpaths. | No capability-token connection auth, no re-auth frame, no `append_rollup_window`, no `until_attach`/`attach_serial`, no publish-side mutation ack API. Extras are not full passthrough for all wire formats, and numeric serial paths use JS `number`, so U6/U7 need E2 fixes before enablement. |
| `@sockudo/ai-transport` | Adapter package, not a socket client. It already models `Serial = number | string`, `MessageAck`, `AppendRollupWindow`, `untilAttach`, `attachSerial`, presence update hooks, and mutation methods in `client-sdks/sockudo-ai-transport-js/src/realtime/types.ts:5` and `client-sdks/sockudo-ai-transport-js/src/realtime/adapter.ts:224`. It validates rollup at `client-sdks/sockudo-ai-transport-js/src/realtime/adapter.ts:401` and uses BigInt/string comparison at `client-sdks/sockudo-ai-transport-js/src/realtime/adapter.ts:386`. | Depends on underlying `@sockudo/client` methods that are not yet present. The pnpm baseline was blocked by dependency policy in this dirty checkout, so keep it as adapter-shaped coverage, not proof that U1-U7 are shippable. |
| `Sockudo.Client` (.NET) | V1/V2, channel auth, user auth, recovery, delta, presence, presence history, channel history, annotations, push proxy, and consume-side mutable messages. Evidence: options and params in `client-sdks/sockudo-dotnet/src/Sockudo.Client/Models.cs:171`, channel history in `client-sdks/sockudo-dotnet/src/Sockudo.Client/Models.cs:309`, mutable state in `client-sdks/sockudo-dotnet/src/Sockudo.Client/VersionedMessages.cs:14`, dispatch in `client-sdks/sockudo-dotnet/src/Sockudo.Client/SockudoClient.cs:1379`. | No capability-token connection auth, no presence update, no attach serial, no rollup param, no publish-side mutation ack API. `SockudoEvent.Serial` is `int?` at `client-sdks/sockudo-dotnet/src/Sockudo.Client/Models.cs:588` and `CoerceInt` casts `long` to `int` at `client-sdks/sockudo-dotnet/src/Sockudo.Client/ProtocolCodec.cs:494`, so U7 is red. Extras decode is known-field only at `client-sdks/sockudo-dotnet/src/Sockudo.Client/ProtocolCodec.cs:463`. |
| `sockudo_flutter` | V1/V2, channel auth, recovery, rewind, delta, tag filter, presence add/remove, presence history, channel history, annotations, push proxy, consume-side mutable-message helpers. Evidence: options in `client-sdks/sockudo-flutter/lib/src/client.dart:19`, channel history params in `client-sdks/sockudo-flutter/lib/src/models.dart:229`, message extras in `client-sdks/sockudo-flutter/lib/src/models.dart:502`, dispatch in `client-sdks/sockudo-flutter/lib/src/client.dart:830`. | No capability-token auth, no presence update, no attach serial/until_attach, no rollup param, no publish mutation ack API. Dart VM ints are fine, but web JSON paths need explicit >2^53 coverage. Extras are typed/known-field, so U6 needs passthrough verification. |
| `sockudo-kotlin` | V1/V2, channel auth, recovery, rewind, delta, tag filter, presence add/remove, presence history, channel history, annotations, push-related helpers, consume-side mutable-message helpers. Evidence: `ignoreUnknownKeys` in `client-sdks/sockudo-kotlin/lib/src/main/kotlin/io/sockudo/client/Support.kt:34`, channel history params in `client-sdks/sockudo-kotlin/lib/src/main/kotlin/io/sockudo/client/Models.kt:274`, mutable reducer in `client-sdks/sockudo-kotlin/lib/src/main/kotlin/io/sockudo/client/VersionedMessages.kt:37`. | No capability-token auth, no presence update, no attach serial/until_attach, no rollup param, no publish mutation ack API. Longs are used for many history paths, but string numeric headers parse through `Double` at `client-sdks/sockudo-kotlin/lib/src/main/kotlin/io/sockudo/client/VersionedMessages.kt:37`, so U7 needs a boundary fix. Extras are known-field. |
| `sockudo-python` | V1/V2 prefix handling, channel auth/user auth, recovery, rewind, delta, tag filtering, presence add/remove, presence history and snapshot. Evidence: options in `client-sdks/sockudo-python/src/sockudo_python/client.py:393`, prefix handling in `client-sdks/sockudo-python/src/sockudo_python/client.py:581`, subscription params in `client-sdks/sockudo-python/src/sockudo_python/client.py:1386`, presence history in `client-sdks/sockudo-python/src/sockudo_python/client.py:1491`. | No channel history API found, no capability-token auth, no presence update, no attach serial/until_attach, no rollup param, no publish mutation ack API. Python ints are safe, but extras are known-field only at `client-sdks/sockudo-python/src/sockudo_python/client.py:967`. |
| `SockudoSwift` | V1/V2, channel auth, recovery, delta, presence add/remove, presence history, channel history, annotations, push proxy, consume-side mutable-message helpers. Evidence: options in `client-sdks/sockudo-swift/Sources/SockudoSwift/SockudoClient.swift:27`, channel history params in `client-sdks/sockudo-swift/Sources/SockudoSwift/Support.swift:142`, protocol decode in `client-sdks/sockudo-swift/Sources/SockudoSwift/ProtocolCodec.swift:27`, mutable reducer in `client-sdks/sockudo-swift/Sources/SockudoSwift/VersionedMessages.swift:84`. | No capability-token auth, no presence update, no attach serial/until_attach, no rollup param, no publish mutation ack API. Main event serials decode through `NSNumber.intValue` at `client-sdks/sockudo-swift/Sources/SockudoSwift/ProtocolCodec.swift:104`, so U7 is red even though some history HTTP paths use `Int64`. Extras are known-field. |

## Server SDK Protocol Coverage

| Server SDK | Implemented HTTP surface | Missing or risky for planned additive work |
|---|---|---|
| Node | Trigger/batch/auth/channel info/history style helpers, dynamic JSON response parsing, TypeScript types for webhook/event data. | Runtime is tolerant, but TypeScript union surfaces must be widened additively for `member_updated`, `ai_*`, mutation ack fields, and `extras.ai`. |
| Python | HTTP trigger/auth helpers and webhook parser. `Webhook.parse` constructs `WebhookEvent(**event)` at `server-sdks/sockudo-http-python/src/sockudo_http_python/client.py:398`. | Strict webhook event object construction rejects unknown webhook fields. Needs E3 before new webhook fields/event types. |
| .NET | Trigger/batch/auth/channel helpers and webhook validation. Newtonsoft ignores unknown object fields by default, but webhook event data is `Dictionary<string,string>[]` at `server-sdks/sockudo-http-dotnet/SockudoServer/WebHookData.cs:16`. | New webhook payload values that are nested objects can fail. Needs E3 pass-through event representation. |
| Go | Trigger/batch/channel/history/versioned/annotation/push/auth/webhook helpers. `TriggerParams` and `MessageExtras` are in `server-sdks/sockudo-http-go/client.go:197`; webhook parse is in `server-sdks/sockudo-http-go/webhook.go:8`. | JSON unknown object fields are ignored, but `WebhookEvent.Data string` is strict for non-string event data. `MutationResponse` lacks `history_serial` at `server-sdks/sockudo-http-go/response_parsing.go:329`. |
| Java | Gson writer and raw/string result style in `server-sdks/sockudo-http-java/src/main/java/io/sockudo/rest/SockudoAbstract.java:33`; trigger/batch at `server-sdks/sockudo-http-java/src/main/java/io/sockudo/rest/SockudoAbstract.java:376`; history generic params at `server-sdks/sockudo-http-java/src/main/java/io/sockudo/rest/SockudoAbstract.java:529`. | Low parser risk because responses are mostly raw/generic, but typed extras and history helpers need additive E5 coverage. No webhook parse helper found. |
| PHP | Trigger/batch/channel/webhook helpers. Webhook uses dynamic `json_decode(..., false, JSON_THROW_ON_ERROR)` and `stdClass` in `server-sdks/sockudo-http-php/src/Sockudo.php:780`; wrapper is dynamic at `server-sdks/sockudo-http-php/src/Webhook.php:5`. | Parser tolerant. Needs additive typed examples and optional E5 fields, plus test-suite config issue #297. |
| Ruby | Dynamic trigger/channel/webhook helpers. Webhook JSON parse and event access are in `server-sdks/sockudo-http-ruby/lib/sockudo/webhook.rb:27`. | Parser tolerant to unknown event names/fields. Local baseline blocked by old Ruby/Bundler. |
| Rust | Trigger/history/webhook helpers. Webhook data uses `Vec<HashMap<String,String>>` at `server-sdks/sockudo-http-rust/src/webhook.rs:17`, and event enum has `Unknown(String)` at `server-sdks/sockudo-http-rust/src/events.rs:9`. | Unknown event names are tolerated, but non-string webhook values fail. Needs E3. Mutation response lacks `history_serial`; history params lack `until_attach`. |
| Swift | Trigger/channel/history/webhook helpers. Webhook decoding uses `JSONDecoder` at `server-sdks/sockudo-http-swift/Sources/Sockudo/Services/WebhookService.swift:100`, and webhook event type is a strict enum at `server-sdks/sockudo-http-swift/Sources/Sockudo/Models/WebhookEventType.swift:4`. | Highest E3 risk: unknown `member_updated` or `ai_*` webhook event names fail enum decode. |

## Parser Strictness Risk Register

| SDK | Decode site | Strictness | Break risk vs planned additive changes | Required E2/E3 fix |
|---|---|---|---|---|
| `@sockudo/client` | `client-sdks/sockudo-js/src/core/connection/protocol/protocol.ts:91` and channel dispatch in `client-sdks/sockudo-js/src/core/channels/channel.ts:379` | Event names tolerant; extras and serial normalization are lossy in some formats | New `extras.ai` can be dropped; `history_serial`/`delivery_serial` >2^53 can truncate | E2: unknown extras passthrough and BigInt/string serial handling |
| `@sockudo/ai-transport` | `client-sdks/sockudo-ai-transport-js/src/realtime/adapter.ts:565`, `client-sdks/sockudo-ai-transport-js/src/realtime/adapter.ts:893` | Tolerant adapter normalization | Underlying `@sockudo/client` gaps can still drop extras/serials | Keep adapter tests, but gate shipping on underlying client E2/P1 |
| .NET client | `client-sdks/sockudo-dotnet/src/Sockudo.Client/ProtocolCodec.cs:38`, `client-sdks/sockudo-dotnet/src/Sockudo.Client/ProtocolCodec.cs:494` | Unknown fields tolerant through dictionary normalization; numeric serial strict/lossy | Additive fields ignored safely, but serials truncate to `int`; extras tiers dropped | E2: `long`/string serials and raw extras passthrough |
| Flutter client | `client-sdks/sockudo-flutter/lib/src/support.dart:94`, `client-sdks/sockudo-flutter/lib/src/client.dart:830` | Map/event tolerant | Web builds can lose >2^53 serial precision; extras tiers may be dropped | E2: string/BigInt-safe serials for web, raw extras passthrough |
| Kotlin client | `client-sdks/sockudo-kotlin/lib/src/main/kotlin/io/sockudo/client/Support.kt:34`, `client-sdks/sockudo-kotlin/lib/src/main/kotlin/io/sockudo/client/ProtocolCodec.kt:44` | JSON configured with `ignoreUnknownKeys`; map decode tolerant | Numeric strings parse via `Double`; extras tiers dropped | E2: integer-string parser and raw extras passthrough |
| Python client | `client-sdks/sockudo-python/src/sockudo_python/client.py:849`, `client-sdks/sockudo-python/src/sockudo_python/client.py:967` | Envelope tolerant, protobuf skips unknown | Extras tiers dropped; channel history absent | E2: raw extras passthrough; E4 add channel history when server feature exists |
| Swift client | `client-sdks/sockudo-swift/Sources/SockudoSwift/ProtocolCodec.swift:27`, `client-sdks/sockudo-swift/Sources/SockudoSwift/ProtocolCodec.swift:104` | Unknown fields mostly tolerated by map/protobuf reader | `NSNumber.intValue` truncates serials; extras tiers dropped | E2: `Int64`/string serials and raw extras passthrough |
| Node server | Runtime `JSON.parse` and dynamic request/response handling | Tolerant runtime, stricter TS declarations | Compile-time types can reject new event names/fields | E3: widen types while retaining unknown fallback |
| Python server | `server-sdks/sockudo-http-python/src/sockudo_http_python/client.py:398` | Strict dataclass construction | Unknown webhook fields or event shapes can throw | E3: preserve raw event dictionary and typed projection |
| .NET server | `server-sdks/sockudo-http-dotnet/SockudoServer/WebHookData.cs:16` | Unknown fields ignored; value types strict strings | Nested webhook data for `ai_*`/annotations can fail | E3: typed plus raw webhook event representation |
| Go server | `server-sdks/sockudo-http-go/webhook.go:8` | Unknown fields ignored; `Data string` strict | Nested webhook data can fail | E3: raw JSON message or `map[string]any` event data |
| Java server | `server-sdks/sockudo-http-java/src/main/java/io/sockudo/rest/SockudoAbstract.java:33` | Mostly raw/generic | Low break risk; typed extras incomplete | E3/E5: add tolerant typed helpers if webhook parsing is introduced |
| PHP server | `server-sdks/sockudo-http-php/src/Sockudo.php:780` | Tolerant dynamic `stdClass` | Low break risk | No E3 parser fix required; add E5 fields/tests |
| Ruby server | `server-sdks/sockudo-http-ruby/lib/sockudo/webhook.rb:27` | Tolerant dynamic hash | Low break risk | No E3 parser fix required; add E5 fields/tests |
| Rust server | `server-sdks/sockudo-http-rust/src/webhook.rs:17` | Unknown event names tolerated; values strict strings | Nested webhook data can fail | E3: `serde_json::Value` raw event values |
| Swift server | `server-sdks/sockudo-http-swift/Sources/Sockudo/Models/WebhookEventType.swift:4` | Strict enum decode | New webhook event names fail decode | E3: unknown enum case/raw string preservation |

## Baseline Runs

Current server was built with `cargo build -p sockudo --features ai-transport` before the V1 canary.
Full AI Transport U1-U7 integration coverage is not available yet; these are compatibility
baselines against the current build and current SDK suites.

| Package | Command | Result | Notes |
|---|---|---|---|
| `client-sdks/sockudo-js` | `bun run test` | Pass | First run: 12 suites passed, 43 tests passed. A later concurrent rerun failed on missing optional React/Vue peer deps after the AI Transport pnpm attempt changed local install state; baseline status remains first-run pass with caveat. |
| `client-sdks/sockudo-ai-transport-js` | `CI=true pnpm test` | Blocked/red | pnpm failed before tests with `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION` for newly published `@ai-sdk/mcp@2.0.1` and `@ai-sdk/react@4.0.3`. Lockfile/package state was already dirty, so no issue was filed. |
| `client-sdks/sockudo-python` | `python3 -m pytest` | Blocked | Local `/usr/bin/python3` is Python 3.9.6 and lacks pytest; package requires Python `>=3.10`. |
| `client-sdks/sockudo-dotnet` | `dotnet test tests/Sockudo.Client.Tests/Sockudo.Client.Tests.csproj --configuration Release --verbosity normal` | Pass | 17 tests passed. |
| `client-sdks/sockudo-flutter` | `flutter pub get && flutter test` | Pass | 18 tests passed. |
| `client-sdks/sockudo-kotlin` | `./gradlew --no-daemon :lib:test` | Pass | Build successful; JDK 25 emitted Unsafe/deprecation warnings. |
| `client-sdks/sockudo-swift` | `swift test` | Pass | 17 Swift Testing tests passed; XCTest had 0 tests. |
| `server-sdks/sockudo-http-node` | `npm run local-test` | Pass | 152 tests passed. |
| `server-sdks/sockudo-http-python` | `python3 -m pytest` | Blocked | Local Python environment lacks pytest. |
| `server-sdks/sockudo-http-dotnet` | `dotnet test sockudo-dotnet-server.sln` and `dotnet test pusher-dotnet-server.sln` | Pass | Sockudo solution: 142 passed, 54 skipped. Pusher solution: 133 passed, 54 skipped. Nullable warnings only. |
| `server-sdks/sockudo-http-go` | `go test ./...` | Pass | Green. |
| `server-sdks/sockudo-http-java` | `./gradlew --no-daemon test` | Pass | Build successful; Gradle deprecation warnings. |
| `server-sdks/sockudo-http-php` | `composer install --no-interaction --prefer-dist && vendor/bin/phpunit` | Fail | Exit 1 despite 156 tests and 158 assertions completing; 21 PHPUnit warnings and 1 deprecation. Filed #297. |
| `server-sdks/sockudo-http-ruby` | `bundle exec rake spec` | Blocked | Local Ruby 2.6.10/Bundler 1.17.2 cannot satisfy Gemfile.lock Bundler 4.0.11. |
| `server-sdks/sockudo-http-rust` | `cargo test --all-features` | Pass | 43 tests passed; doc tests 0. |
| `server-sdks/sockudo-http-swift` | `swift test` | Pass | 97 tests passed, 35 skipped live tests due unset live credentials. |

## Third-Party V1 Canary

Canary packages:

- npm `pusher-js` 8.5.0
- npm `pusher` 5.3.4
- `ws@latest`

Server command:

```bash
cargo build -p sockudo --features ai-transport
./target/debug/sockudo --config config/config.toml
```

Observed:

- Vanilla `pusher-js` connected to the current server.
- `pusher:subscription_succeeded` was delivered on `public-canary`.
- Official Node `pusher` returned `{"size":0,"timeout":0}` for trigger.
- The subscribed client did not receive the application event within 10 seconds.

Diagnostic output:

```text
CONNECTED
CHANNEL_GLOBAL pusher:subscription_succeeded {}
SUBSCRIBED
TRIGGER_RESULT {"size":0,"timeout":0}
timeout connected=true subscribed=true triggered=true seen=[subscription_succeeded only]
```

Status: V1 canary failed publish-to-deliver. Filed #298.

## Gaps Feeding Later Prompts

### Client SDK U1-U7 Gaps

| SDK | U1 auth | U2 presence update | U3 history/until_attach | U4 mutation acks | U5 rollup | U6 extras passthrough | U7 serial safety |
|---|---|---|---|---|---|---|---|
| `@sockudo/client` | absent | absent | partial history, missing `until_attach`/`attach_serial` | consume only, publish absent | absent | partial/risky | red for JS number paths |
| `@sockudo/ai-transport` | passthrough only | adapter-shaped, underlying absent | adapter-shaped | adapter-shaped | adapter-shaped | normalizes `extras.ai`, underlying risky | green inside adapter, underlying risky |
| .NET client | absent | absent | partial | consume only | absent | partial/risky | red, `int?` event serial |
| Flutter client | absent | absent | partial | consume only | absent | partial/risky | needs VM and web boundary tests |
| Kotlin client | absent | absent | partial | consume only | absent | partial/risky | red for string numeric headers |
| Python client | absent | absent | channel history absent | absent | absent | partial/risky | mostly safe, still test boundary |
| Swift client | absent | absent | partial | consume only | absent | partial/risky | red, `NSNumber.intValue` event serial |

No U1-U5 support should ship until the corresponding server feature is merged. U6/U7 are
forward-compatibility hardening items and should be safe to do in E2 where they only preserve
existing data better.

### Server SDK E3/E5 Gaps

| SDK | E3 parser hardening | E5 enablement notes |
|---|---|---|
| Node | Widen TypeScript unions and preserve unknown webhook/event names | Add optional `extras.ai`, mutation ack fields, history pagination/until_attach helpers |
| Python | Replace strict `WebhookEvent(**event)` with raw event preservation | Add optional trigger/mutation/history/webhook AI fields after server support lands |
| .NET | Preserve raw webhook event values beyond `Dictionary<string,string>` | Add optional trigger/mutation/history/webhook AI fields |
| Go | Change webhook data to raw JSON/map representation | Add `history_serial`, `extras.ai`, until_attach, and mutation helpers |
| Java | Verify no hidden strict webhook parser before E5 | Add typed helpers/examples while keeping raw responses |
| PHP | Parser already tolerant | Add optional fields/helpers; fix suite warning baseline first |
| Ruby | Parser already tolerant | Add optional fields/helpers once local modern Ruby baseline is green |
| Rust | Change webhook value representation from `String` to raw JSON | Add `history_serial`, `extras.ai`, until_attach, and mutation helpers |
| Swift | Add unknown webhook event enum/raw string fallback | Add optional fields/helpers after E3 |

## Plan Corrections

`plans/ai-transport/03-existing-sdks-prompts.md` was updated to reflect:

- 7 client packages in tree, not 5.
- SDK directories are imported monorepo package directories, not submodules.
- `sockudo-python` requires E2/E4 coverage.
- `@sockudo/ai-transport` is an adapter package with its own CI/release lane and should be
  tracked alongside, but not treated as a standalone realtime socket implementation.
