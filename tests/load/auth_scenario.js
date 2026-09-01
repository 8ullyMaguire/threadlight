import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up
    { duration: '1m', target: 50 },   // Peak
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],    // Less than 1% failure rate
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export default function () {
  // Register a new user
  const uniqueId = Date.now() + __VU;
  const payload = JSON.stringify({
    username: `loadtest_${uniqueId}`,
    email: `loadtest_${uniqueId}@test.com`,
    password: 'testpassword123',
  });

  const registerRes = http.post(`${BASE_URL}/api/v1/auth/register`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(registerRes, {
    'register success': (r) => r.status === 201 || r.status === 409, // 409 if already exists
  });

  // Login with the user
  const loginPayload = JSON.stringify({
    email: `loadtest_${uniqueId}@test.com`,
    password: 'testpassword123',
  });

  const loginRes = http.post(`${BASE_URL}/api/v1/auth/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, { 'login success': (r) => r.status === 200 });

  if (loginRes.status === 200) {
    const token = loginRes.json().token;

    // Create a post
    const postPayload = JSON.stringify({
      title: `Load Test Post ${uniqueId}`,
      body: 'This is a load test post body that tests the system under high concurrency.',
      mood: 1,
    });

    const postRes = http.post(`${BASE_URL}/api/v1/posts`, postPayload, {
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    });

    check(postRes, { 'create post success': (r) => r.status === 201 });

    // Get feed
    const feedRes = http.get(`${BASE_URL}/api/v1/feeds?limit=20&offset=0`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    check(feedRes, { 'feed load success': (r) => r.status === 200 });
  }

  sleep(1);
}
