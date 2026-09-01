import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 100 },  // Ramp to 100 concurrent users
    { duration: '3m', target: 100 },  // Stay at 100
    { duration: '1m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export function setup() {
  // Create a test user and get token once, share across VUs
  const res = http.post(`${BASE_URL}/api/v1/auth/register`, JSON.stringify({
    username: `feedtest_${Date.now()}`,
    email: `feedtest_${Date.now()}@test.com`,
    password: 'testpassword123',
  }), { headers: { 'Content-Type': 'application/json' } });

  if (res.status === 201) {
    return { token: res.json().token };
  }
  // Try login if already exists
  const loginRes = http.post(`${BASE_URL}/api/v1/auth/login`, JSON.stringify({
    email: `feedtest_${Date.now()}@test.com`,
    password: 'testpassword123',
  }), { headers: { 'Content-Type': 'application/json' } });
  return { token: loginRes.json().token };
}

export default function (data) {
  const params = { headers: { 'Authorization': `Bearer ${data.token}` } };

  // Multiple feed loads with random moods
  const moods = ['all', 'educational', 'entertaining', 'social', 'creative'];
  const mood = moods[Math.floor(Math.random() * moods.length)];

  const res = http.get(`${BASE_URL}/api/v1/feeds?mood=${mood}&limit=20`, params);
  check(res, { 'feed loaded': (r) => r.status === 200 });

  // Also load hot feed
  const hotRes = http.get(`${BASE_URL}/api/v1/feeds/hot`, params);
  check(hotRes, { 'hot feed loaded': (r) => r.status === 200 });

  sleep(Math.random() * 3 + 1);
}
