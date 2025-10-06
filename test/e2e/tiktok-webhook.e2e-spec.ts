import * as crypto from 'crypto';
import { TikTokService } from '../../src/main/service/tiktokService';

describe('TikTokService (branch coverage)', () => {
    const leads = { upsertFromTikTok: jest.fn().mockResolvedValue({ id: 1 }) };
    const cfg = { getFieldMapping: jest.fn().mockResolvedValue({}) };
    const jobs = { enqueueLeadSync: jest.fn().mockResolvedValue(undefined) };

    beforeEach(() => {
        jest.resetAllMocks();
        process.env.NODE_ENV = 'test';
        delete process.env.SKIP_SIGNATURE_VERIFY;
        delete process.env.TIKTOK_WEBHOOK_SECRET;
    });

    it('dev mode (skip verify): fallback Unknown + email/phone undefined', async () => {
        const svc = new TikTokService(leads as any, cfg as any, jobs as any);

        const payload = { event_id: 'e1' };
        await svc.processWebhook(undefined, payload);

        expect(leads.upsertFromTikTok).toHaveBeenCalledWith(
            expect.objectContaining({
                external_id: 'e1',
                source: 'tiktok',
                name: 'Unknown',
                email: undefined,
                phone: undefined,
            }),
        );
    });

    it('dev mode (skip verify): trim + lowercase email, normalizePhone', async () => {
        const svc = new TikTokService(leads as any, cfg as any, jobs as any);

        const payload = {
            event_id: 'e2',
            lead_data: { full_name: '  A ', email: 'A@EX.COM ', phone: '0901 234 567' },
        };
        await svc.processWebhook(undefined, payload);

        expect(leads.upsertFromTikTok).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'A',
                email: 'a@ex.com',
                phone: '84901234567',
            }),
        );
    });

    it('production: verify OK với chữ ký HMAC-SHA256', async () => {
        process.env.NODE_ENV = 'production';
        process.env.SKIP_SIGNATURE_VERIFY = '0';
        process.env.TIKTOK_WEBHOOK_SECRET = 's1';

        const svc = new TikTokService(leads as any, cfg as any, jobs as any);

        const payload = {
            event_id: 'e3',
            lead_data: { full_name: 'B', email: 'b@ex.com' },
        };
        const raw = Buffer.from(JSON.stringify(payload));
        const sig = crypto.createHmac('sha256', 's1').update(raw).digest('base64');

        await expect(svc.processWebhook(sig, payload, raw)).resolves.toEqual(
            expect.objectContaining({ ok: true }),
        );
        expect(leads.upsertFromTikTok).toHaveBeenCalled();
    });

    it('production: thiếu webhook secret → 401', async () => {
        process.env.NODE_ENV = 'production';
        process.env.SKIP_SIGNATURE_VERIFY = '0';
        delete process.env.TIKTOK_WEBHOOK_SECRET;

        const svc = new TikTokService(leads as any, cfg as any, jobs as any);

        await expect(
            svc.processWebhook('anything', { event_id: 'e' }, Buffer.from('{}')),
        ).rejects.toBeTruthy();
    });

    it('production: thiếu signature → 401', async () => {
        process.env.NODE_ENV = 'production';
        process.env.SKIP_SIGNATURE_VERIFY = '0';
        process.env.TIKTOK_WEBHOOK_SECRET = 's1';

        const svc = new TikTokService(leads as any, cfg as any, jobs as any);

        await expect(
            svc.processWebhook(undefined, { event_id: 'e' }, Buffer.from('{}')),
        ).rejects.toBeTruthy();
    });

    it('production: chữ ký sai → 401', async () => {
        process.env.NODE_ENV = 'production';
        process.env.SKIP_SIGNATURE_VERIFY = '0';
        process.env.TIKTOK_WEBHOOK_SECRET = 's1';

        const svc = new TikTokService(leads as any, cfg as any, jobs as any);
        const payload = { event_id: 'e' };
        const raw = Buffer.from(JSON.stringify(payload));

        await expect(svc.processWebhook('WRONG', payload, raw)).rejects.toBeTruthy();
    });

    it('applyMapping: tạo object theo mapping và enqueue đúng dữ liệu', async () => {
        cfg.getFieldMapping.mockResolvedValue({
            'lead_data.email': 'EMAIL',
            'campaign.campaign_id': 'CAMP_ID',
        });

        const svc = new TikTokService(leads as any, cfg as any, jobs as any);
        const payload = {
            event_id: 'e4',
            lead_data: { email: 'x@ex.com' },
            campaign: { campaign_id: 'c9' },
        };

        await svc.processWebhook(undefined, payload);

        expect(jobs.enqueueLeadSync).toHaveBeenCalledWith(
            'e4',
            expect.objectContaining({ EMAIL: 'x@ex.com', CAMP_ID: 'c9' }),
        );
    });
});
