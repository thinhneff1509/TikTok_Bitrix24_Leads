import { TikTokService } from '../../src/main/service/tiktokService';
import { UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

describe('TikTokService (unit)', () => {
    const OLD_ENV = process.env;

    let leads: any;
    let cfg: any;
    let jobs: any;

    const payload = {
        event_id: 'evt_123',
        lead_data: { full_name: 'A', email: 'A@EX.com', phone: '0901234567' },
        campaign: { campaign_id: 'c1', ad_id: 'a1' },
    };

    const sign = (buf: Buffer, secret: string) =>
        crypto.createHmac('sha256', secret).update(buf).digest('base64');

    beforeEach(() => {
        jest.resetAllMocks();
        process.env = { ...OLD_ENV };

        leads = { upsertFromTikTok: jest.fn().mockResolvedValue({ id: 1 }) };
        cfg = {
            getFieldMapping: jest
                .fn()
                .mockResolvedValue({ 'lead_data.email': 'EMAIL' }),
        };
        jobs = { enqueueLeadSync: jest.fn().mockResolvedValue(undefined) };
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    it('DEV mode: skip verify, normalize email/phone & enqueue với mapping', async () => {
        process.env.NODE_ENV = 'test';
        process.env.SKIP_SIGNATURE_VERIFY = '1';

        const svc = new TikTokService(leads as any, cfg as any, jobs as any);
        const res = await svc.processWebhook(undefined, payload);

        expect(res.ok).toBe(true);
        expect(leads.upsertFromTikTok).toHaveBeenCalledWith(
            expect.objectContaining({
                external_id: 'evt_123',
                source: 'tiktok',
                name: 'A',
                email: 'a@ex.com',
                phone: '84901234567',
                campaign_id: 'c1',
                ad_id: 'a1',
            }),
        );
        expect(cfg.getFieldMapping).toHaveBeenCalled();
        expect(jobs.enqueueLeadSync).toHaveBeenCalledWith(
            'evt_123',
            expect.objectContaining({ EMAIL: 'A@EX.com' }),
        );
    });

    it('PROD: throw 401 khi thiếu secret', async () => {
        process.env.NODE_ENV = 'production';
        delete process.env.TIKTOK_WEBHOOK_SECRET;

        const svc = new TikTokService(leads as any, cfg as any, jobs as any);
        await expect(svc.processWebhook('x', payload)).rejects.toBeInstanceOf(
            UnauthorizedException,
        );
    });

    it('PROD: throw 401 khi thiếu signature', async () => {
        process.env.NODE_ENV = 'production';
        process.env.TIKTOK_WEBHOOK_SECRET = 's';

        const svc = new TikTokService(leads as any, cfg as any, jobs as any);
        // @ts-ignore
        await expect(svc.processWebhook(undefined, payload)).rejects.toBeInstanceOf(
            UnauthorizedException,
        );
    });

    it('PROD: throw 401 khi signature sai', async () => {
        process.env.NODE_ENV = 'production';
        process.env.TIKTOK_WEBHOOK_SECRET = 's';

        const svc = new TikTokService(leads as any, cfg as any, jobs as any);
        await expect(svc.processWebhook('WRONG', payload)).rejects.toBeInstanceOf(
            UnauthorizedException,
        );
    });

    it('PROD: signature hợp lệ với rawBody', async () => {
        process.env.NODE_ENV = 'production';
        process.env.TIKTOK_WEBHOOK_SECRET = 'sec';
        const raw = Buffer.from('RAW-BODY');
        const sig = sign(raw, 'sec');

        const svc = new TikTokService(leads as any, cfg as any, jobs as any);
        await expect(svc.processWebhook(sig, payload, raw)).resolves.toEqual(
            expect.objectContaining({ ok: true }),
        );
    });

    it('PROD: signature hợp lệ tính từ JSON.stringify(payload) (không rawBody)', async () => {
        process.env.NODE_ENV = 'production';
        process.env.TIKTOK_WEBHOOK_SECRET = 'sec2';
        const buf = Buffer.from(JSON.stringify(payload));
        const sig = sign(buf, 'sec2');

        const svc = new TikTokService(leads as any, cfg as any, jobs as any);
        await expect(svc.processWebhook(sig, payload)).resolves.toEqual(
            expect.objectContaining({ ok: true }),
        );
    });

    it('processWebhook: production + MISSING SECRET -> 401', async () => {
        process.env.NODE_ENV = 'production';
        process.env.SKIP_SIGNATURE_VERIFY = '0';
        delete process.env.TIKTOK_WEBHOOK_SECRET;

        const svc = new TikTokService(leads as any, cfg as any, jobs as any);
        await expect(svc.processWebhook('x', { a: 1 }, Buffer.from('{}')))
            .rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('processWebhook: production + has secret BUT missing signature -> 401', async () => {
        process.env.NODE_ENV = 'production';
        process.env.SKIP_SIGNATURE_VERIFY = '0';
        process.env.TIKTOK_WEBHOOK_SECRET = 'secret-abc';

        const svc = new TikTokService(leads as any, cfg as any, jobs as any);
        await expect(svc.processWebhook(undefined, { a: 1 }, Buffer.from('{}')))
            .rejects.toBeInstanceOf(UnauthorizedException);
    });

});
