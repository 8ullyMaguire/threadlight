# Load Testing with k6

## Install k6
```bash
# macOS
brew install k6
# Linux
sudo apt install k6  # or download from https://k6.io
```

## Run Tests
```bash
# Start the backend first, then:
k6 run tests/load/auth_scenario.js
k6 run tests/load/feed_scenario.js

# With custom base URL:
k6 run -e BASE_URL=https://staging.polaris.social tests/load/auth_scenario.js
```

## Scenarios
- auth_scenario.js: Register + Login + Create Post + Load Feed (ramp to 50 users)
- feed_scenario.js: Heavy feed reading (ramp to 100 concurrent users, 3 min hold)

## Thresholds
- p(95) response time < 500ms for auth, < 1000ms for feed
- Error rate < 1% for auth, < 5% for feed
