import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp } from '../test-app.factory';

describe('Swagger docs', () => {
    let app: INestApplication;

    beforeAll(async () => (app = await createTestApp()));
    afterAll(async () => app.close());

    it('GET /docs -> 200 (nếu mounted) hoặc 404 (trong test)', async () => {
        const res = await request(app.getHttpServer()).get('/docs');
        expect([200, 404]).toContain(res.status);
        if (res.status === 200) expect(res.text).toContain('SwaggerUI');
    });
});
