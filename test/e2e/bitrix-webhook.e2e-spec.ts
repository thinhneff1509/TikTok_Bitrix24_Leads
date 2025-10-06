import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp } from '../test-app.factory';

describe('Bitrix Webhook E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });
  afterAll(async () => {
    await app.close();
  });

  it('POST /webhooks/bitrix24/deals -> 200', async () => {
    const payload = {
      id: 'B24_12345',
      title: 'Bitrix deal',
      amount: 5_000_000,
      currency: 'VND',
      lead_external_id: 'evt_1001',
      custom_fields: { SOURCE: 'tiktok' },
    };

    const res = await request(app.getHttpServer())
      .post('/webhooks/bitrix24/deals')
      .send(payload)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({ ok: true, external_id: 'B24_12345' }),
    );
  });
});
