import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp } from '../test-app.factory';

describe('Leads & Deals E2E', () => {
    let app: INestApplication;
    beforeAll(async () => (app = await createTestApp()));
    afterAll(async () => app.close());

    it('GET /api/v1/leads -> 200', async () => {
        await request(app.getHttpServer())
            .get('/api/v1/leads?page=1&limit=10')
            .expect(200);
    });

    it('POST /api/v1/leads/{id}/convert-to-deal -> 200|201', async () => {
        const id = '11111111-1111-4111-8111-111111111111';
        const res = await request(app.getHttpServer())
            .post(`/api/v1/leads/${id}/convert-to-deal`)
            .send({ title: 'Deal X', amount: 100000, currency: 'VND' });

        expect([200, 201]).toContain(res.status);
    });

    it('GET /api/v1/deals -> 200 (nếu pass validation) hoặc 400 (invalid query)', async () => {
        const r = await request(app.getHttpServer())
            .get('/api/v1/deals?page=1&limit=10');

        expect([200, 400]).toContain(r.status);
        if (r.status === 200) {
            expect(r.body).toHaveProperty('items');
            expect(r.body).toHaveProperty('total');
        }
    });
});
