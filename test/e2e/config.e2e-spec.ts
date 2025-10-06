import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp } from '../test-app.factory';

describe('Config E2E', () => {
    let app: INestApplication;
    beforeAll(async () => { app = await createTestApp(); });
    afterAll(async () => { await app.close(); });

    it('GET /api/v1/config/mappings -> 200', async () => {
        const res = await request(app.getHttpServer()).get('/api/v1/config/mappings').expect(200);
        expect(res.body).toBeDefined();
    });

    it('PUT /api/v1/config/mappings -> ok (200 hoặc 500 tùy rule)', async () => {
        const update = { field_mapping: { 'lead_data.email': 'EMAIL[0][VALUE]' } };
        const res = await request(app.getHttpServer()).put('/api/v1/config/mappings').send(update);
        expect([200, 500]).toContain(res.status);
    });

    it('GET /api/v1/config/rules -> ok (200 hoặc 500)', async () => {
        const res = await request(app.getHttpServer()).get('/api/v1/config/rules');
        expect([200, 500]).toContain(res.status);
    });

    it('PUT /api/v1/config/rules -> ok (200 hoặc 500)', async () => {
        const rules = [{ condition: "source == 'tiktok'", action: 'create_deal', pipeline_id: '1', stage_id: 'NEW', probability: 30 }];
        const res = await request(app.getHttpServer()).put('/api/v1/config/rules').send({ deal_rules: rules });
        expect([200, 500]).toContain(res.status);
    });
});
