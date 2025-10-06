import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { createTestApp } from '../test-app.factory';

describe('Config E2E – negative cases (DTO validation / guard rails)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await createTestApp();
    });
    afterAll(async () => {
        await app.close();
    });

    // FieldMappingPayload
    it('PUT /api/v1/config/mappings -> 400 when field_mapping is not an object', async () => {
        await request(app.getHttpServer())
            .put('/api/v1/config/mappings')
            .send({ field_mapping: 'oops' })
            .expect(400);
    });

    it('PUT /api/v1/config/mappings -> 400/500 when field_mapping is empty', async () => {
        await request(app.getHttpServer())
            .put('/api/v1/config/mappings')
            .send({ field_mapping: {} })
            .expect((res) => {
                if (![400, 500].includes(res.status)) {
                    throw new Error(`Expected 400 or 500, got ${res.status}`);
                }
            });
    });


    // DealRulesPayload
    it('PUT /api/v1/config/rules -> 400 when deal_rules is not an array', async () => {
        await request(app.getHttpServer())
            .put('/api/v1/config/rules')
            .send({ deal_rules: {} })
            .expect(400);
    });

    it('PUT /api/v1/config/rules -> 400 when required fields missing (e.g. pipeline_id)', async () => {
        const body = {
            deal_rules: [
                {
                    condition: "source == 'tiktok'",
                    action: 'create_deal',
                    stage_id: 'NEW',
                    probability: 30,
                },
            ],
        };
        await request(app.getHttpServer())
            .put('/api/v1/config/rules')
            .send(body)
            .expect(400);
    });

    it('PUT /api/v1/config/rules -> 400 when probability is negative (business rule)', async () => {
        const body = {
            deal_rules: [
                {
                    condition: "campaign.campaign_name CONTAINS 'sale'",
                    action: 'create_deal',
                    pipeline_id: '1',
                    stage_id: 'NEW',
                    probability: -5, // < 0
                },
            ],
        };
        await request(app.getHttpServer())
            .put('/api/v1/config/rules')
            .send(body)
            .expect(400);
    });
});
