import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { TikTokService } from '../src/main/service/tiktokService';
import { BitrixSyncProcessor } from '../src/main/jobs/bitrixSyncProcessor';

// Fake services
class TikTokServiceFake {
    processWebhook = jest.fn().mockResolvedValue({ ok: true, lead: { id: 'fake' } });
}
class BitrixSyncProcessorFake {
    enqueueDealConversion = jest.fn().mockResolvedValue(undefined);
}

describe('App e2e', () => {
    let app: INestApplication;

    beforeAll(async () => {
        // để controller bỏ qua verify chữ ký khi test
        process.env.NODE_ENV = 'test';
        process.env.SKIP_SIGNATURE_VERIFY = '1';

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            // block logic TikTok real
            .overrideProvider(TikTokService)
            .useClass(TikTokServiceFake)
            // block queue/redis to not open the connection
            .overrideProvider(BitrixSyncProcessor)
            .useClass(BitrixSyncProcessorFake)
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /health', async () => {
        const res = await request(app.getHttpServer())
            .get('/health')
            .expect(200);

        expect(res.body).toEqual({ ok: true });
    });

    it('POST /webhooks/tiktok/leads', async () => {
        await request(app.getHttpServer())
            .post('/webhooks/tiktok/leads')
            .set('content-type', 'application/json')
            .send({
                event_id: 'evt_1001',
                lead_data: {
                    full_name: 'Nguyen Van A',
                    email: 'a@example.com',
                    phone: '+84901234567',
                },
            })
            .expect(200)
            .expect(({ body }) => expect(body.ok).toBe(true));
    });
});
