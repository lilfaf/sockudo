use criterion::{Criterion, criterion_group, criterion_main};
use sockudo_core::version_store::{MemoryVersionStore, StoredVersionRecord, VersionStore};
use sockudo_core::versioned_messages::{
    MessageAppend, MessageSerial, VersionMetadata, VersionSerial, VersionedMessage,
};
use sockudo_protocol::messages::MessageData;

fn version(serial: u64) -> VersionMetadata {
    VersionMetadata {
        serial: VersionSerial::new(format!("ver:{serial:020}")).unwrap(),
        client_id: Some("agent-1".to_string()),
        timestamp_ms: serial as i64,
        description: None,
        metadata: None,
    }
}

fn record_with_data(data: String) -> StoredVersionRecord {
    StoredVersionRecord {
        app_id: "app".to_string(),
        channel: "ai-room".to_string(),
        original_client_id: Some("agent-1".to_string()),
        message: VersionedMessage::new_create(
            MessageSerial::new("msg:1").unwrap(),
            version(1),
            1,
            1,
            Some("ai-output".to_string()),
            Some(MessageData::String(data)),
            None,
        ),
    }
}

fn bench_append_64b_to_100k(c: &mut Criterion) {
    let current = record_with_data("x".repeat(100 * 1024));
    let fragment = "y".repeat(64);

    c.bench_function("versioned_append_64b_to_100k_budget_10us_p50", |b| {
        b.iter(|| {
            let _ = current
                .message
                .apply_append(
                    version(2),
                    2,
                    MessageAppend {
                        data_fragment: fragment.clone(),
                        extras: None,
                    },
                )
                .unwrap();
        });
    });
}

fn bench_warm_get_latest_2000_appends(c: &mut Criterion) {
    let runtime = tokio::runtime::Runtime::new().unwrap();
    let store = runtime.block_on(async {
        let store = MemoryVersionStore::new();
        let mut current = record_with_data(String::new());
        store.append_version(current.clone()).await.unwrap();
        for index in 0..2000 {
            let next = StoredVersionRecord {
                message: current
                    .message
                    .apply_append(
                        version(index + 2),
                        index + 2,
                        MessageAppend {
                            data_fragment: "x".repeat(64),
                            extras: None,
                        },
                    )
                    .unwrap(),
                ..current.clone()
            };
            store.append_version(next.clone()).await.unwrap();
            current = next;
        }
        store
    });
    let serial = MessageSerial::new("msg:1").unwrap();

    c.bench_function("memory_get_latest_2000_appends_warm_budget_50us_p50", |b| {
        b.iter(|| {
            runtime
                .block_on(store.get_latest("app", "ai-room", &serial))
                .unwrap()
                .unwrap();
        });
    });
}

fn criterion_benchmark(c: &mut Criterion) {
    bench_append_64b_to_100k(c);
    bench_warm_get_latest_2000_appends(c);
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
