import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp } from '../test-app.factory';

describe('Leads & Deals E2E – negative cases (DTO validation)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });
  afterAll(async () => {
    await app.close();
  });

  // ListLeadsDto
  it('GET /api/v1/leads -> 400 when page or limit invalid', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/leads?page=0&limit=0') // Min(1)
      .expect(400);

    await request(app.getHttpServer())
      .get('/api/v1/leads?page=1&limit=101') // Max(100)
      .expect(400);
  });

  // ListDealsDto
  it('GET /api/v1/deals -> 400 when page < 1', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/deals?page=0&limit=10')
      .expect(400);
  });

  // ConvertLeadDto
  it('POST /api/v1/leads/{id}/convert-to-deal -> 400 when title missing', async () => {
    const id = '11111111-1111-4111-8111-111111111111';
    await request(app.getHttpServer())
      .post(`/api/v1/leads/${id}/convert-to-deal`)
      .send({ amount: 100000, currency: 'VND' })
      .expect(400);
  });

  it('POST /api/v1/leads/{id}/convert-to-deal -> 400 when amount is negative', async () => {
    const id = '22222222-2222-4222-8222-222222222222';
    await request(app.getHttpServer())
      .post(`/api/v1/leads/${id}/convert-to-deal`)
      .send({ title: 'Deal X', amount: -1, currency: 'VND' })
      .expect(400);
  });

  // LeadIdParam
  it('POST /api/v1/leads/{id}/convert-to-deal -> 400 when id is not UUID', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/leads/not-a-uuid/convert-to-deal')
      .send({ title: 'Deal X' })
      .expect(400);
  });
});
