import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp } from '../test-app.factory';

describe('Analytics & Export E2E', () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await createTestApp();
  });
  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/analytics/conversion-rates -> 200', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/analytics/conversion-rates')
      .expect(200);
    expect(res.body).toEqual(expect.any(Object));
  });

  it('GET /api/v1/analytics/campaign-performance -> 200', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/analytics/campaign-performance')
      .expect(200);
  });

  it('GET /api/v1/reports/export?format=csv -> 200 CSV', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/reports/export?format=csv&date_range=30d')
      .expect(200);
    expect(res.headers['content-type']).toMatch(/text\/csv|octet-stream/);
    expect(res.text).toContain(',');
  });
});
