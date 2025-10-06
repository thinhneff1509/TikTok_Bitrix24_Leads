import { LeadsService } from '../../src/main/service/leadsService';

describe('LeadsService (unit)', () => {
    it('upsertFromTikTok: tạo mới khi chưa tồn tại, merge khi trùng', async () => {
        const repo = {
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockImplementation((x: any) => x),
            merge: jest.fn(),
            save: jest.fn().mockImplementation(async (x: any) => ({ id: 1, ...x })),
        };
        const svc = new LeadsService(repo as any, {} as any, {} as any);

        const lead = await svc.upsertFromTikTok({
            external_id: 'evt_1',
            source: 'tiktok',
            name: 'A',
            email: 'A@EX.com',
            phone: '+8490',
            campaign_id: 'c1',
            ad_id: 'a1',
            raw_data: { x: 1 },
        });

        expect(repo.findOne).toHaveBeenCalled();
        expect(lead.id).toBe(1);
        expect((lead.email as string).toLowerCase()).toBe('a@ex.com');
    });

    it('list: hỗ trợ pagination & filter source', async () => {
        const repo = { findAndCount: jest.fn().mockResolvedValue([[{ id: 1 }], 1]) };
        const svc = new LeadsService(repo as any, {} as any, {} as any);

        const res: any = await svc.list({ page: 1, limit: 10, source: 'tiktok' } as any);
        expect(res.total).toBe(1);
        expect(repo.findAndCount).toHaveBeenCalled();
    });

    it('convertToDeal: tạo deal local & enqueue sync', async () => {
        const repo = { findOneByOrFail: jest.fn().mockResolvedValue({ id: '1', name: 'Nguyen Van A' }) };
        const deals = { create: jest.fn().mockResolvedValue({ id: 10, title: 'Deal for Nguyen Van A' }) };
        const jobs = { enqueueDealConversion: jest.fn().mockResolvedValue(undefined) };

        const svc = new LeadsService(repo as any, deals as any, jobs as any);

        const out = await svc.convertToDeal('1', { amount: 100000, currency: 'VND' } as any, 30);
        expect(out.id).toBe(10);
        expect(deals.create).toHaveBeenCalledWith(
            expect.objectContaining({ external_id: 'local:1' }),
        );
        expect(jobs.enqueueDealConversion).toHaveBeenCalledWith(
            '1',
            expect.objectContaining({ TITLE: expect.any(String) }),
        );
    });

    it('upsertFromTikTok: merge & save khi trùng external_id/email/phone', async () => {
        const existing = { id: 2, external_id: 'evt_1', status: 'new' };
        const repo = {
            findOne: jest.fn().mockResolvedValue(existing),
            merge: jest.fn(),
            save: jest.fn().mockImplementation(async (x: any) => x),
            create: jest.fn(),
        };
        const svc = new LeadsService(repo as any, {} as any, {} as any);

        const data = { external_id: 'evt_1', email: 'A@EX.com', phone: '8490' };
        const out = await svc.upsertFromTikTok(data);

        expect(repo.merge).toHaveBeenCalledWith(existing, data, { status: 'updated' });
        expect(repo.save).toHaveBeenCalledWith(existing);
        expect(repo.create).not.toHaveBeenCalled();
        expect(out).toBe(existing);
    });

    it('list: không truyền source -> where rỗng, không áp ILike', async () => {
        const repo = { findAndCount: jest.fn().mockResolvedValue([[], 0]) };
        const svc = new LeadsService(repo as any, {} as any, {} as any);

        await svc.list({ page: 1, limit: 5 } as any);

        expect(repo.findAndCount).toHaveBeenCalledWith(
            expect.objectContaining({
                where: {},
                order: { created_at: 'DESC' },
                skip: 0,
                take: 5,
            }),
        );
    });

    it('upsertFromTikTok: trùng -> merge và save bản cũ', async () => {
        const existing = { id: 1, external_id: 'evt_1' };
        const repo = {
            findOne: jest.fn().mockResolvedValue(existing),
            merge: jest.fn(),
            save: jest.fn().mockImplementation(async (x:any)=> x),
        };
        const svc = new LeadsService(repo as any, {} as any, {} as any);
        const out = await svc.upsertFromTikTok({ external_id: 'evt_1', name: 'New' });
        expect(repo.merge).toHaveBeenCalledWith(existing, expect.any(Object), { status: 'updated' });
        expect(out.id).toBe(1);
    });

});
