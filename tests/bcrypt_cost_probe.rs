// One-off: how long do 10 bcrypt hashes take at the costs the tests use?
// Run: cargo test --test bcrypt_cost_probe -- --nocapture
use std::time::Instant;

#[test]
fn probe_bcrypt_cost() {
    for cost in [4u32, 10, 12] {
        let start = Instant::now();
        for _ in 0..10 {
            bcrypt::hash("password123", cost).unwrap();
        }
        let per = start.elapsed().as_millis() as f64 / 10.0;
        println!(
            "cost {cost:>2}: {per:>7.1} ms/hash   50 hashes = {:>6.2}s",
            per * 50.0 / 1000.0
        );
    }
}
