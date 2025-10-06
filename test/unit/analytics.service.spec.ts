import { AnalyticsService } from '../../src/main/service/analyticsService';

describe('AnalyticsService (unit)', () => {
    const NOW = new Date('2025-01-31T00:00:00.000Z');

    beforeAll(() => {
        jest.useFakeTimers().setSystemTime(NOW);
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('conversionRates: totalLeads > 0 → tính % chính xác & gọi count() cho cả leads/deals', async () => {
        const leadsRepo = { count: jest.fn().mockResolvedValue(100) } as any;
        const dealsRepo = { count: jest.fn().mockResolvedValue(25) } as any;

        const svc = new AnalyticsService(leadsRepo, dealsRepo);
        const out = await svc.conversionRates(30);

        expect(out.totalLeads).toBe(100);
        expect(out.totalDeals).toBe(25);
        expect(out.rate).toBe(25);

        expect(leadsRepo.count).toHaveBeenCalledTimes(1);
        expect(dealsRepo.count).toHaveBeenCalledTimes(1);

        const arg = (leadsRepo.count as jest.Mock).mock.calls[0][0];
        expect(arg).toHaveProperty('where.created_at');
    });

    it('conversionRates: totalLeads = 0 → nhánh else trả 0', async () => {
        const leadsRepo = { count: jest.fn().mockResolvedValue(0) } as any;
        const dealsRepo = { count: jest.fn().mockResolvedValue(5) } as any;

        const svc = new AnalyticsService(leadsRepo, dealsRepo);
        const out = await svc.conversionRates(7);

        expect(out.totalLeads).toBe(0);
        expect(out.totalDeals).toBe(5);
        expect(out.rate).toBe(0);
    });

    it('campaignPerformance: trả mảng các dòng group-by campaign_id', async () => {
        const qb = {
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockResolvedValue([{ campaign_id: 'c1', leads: 10 }]),
        };

        const leadsRepo = { createQueryBuilder: jest.fn().mockReturnValue(qb) } as any;
        const dealsRepo = {} as any;

        const svc = new AnalyticsService(leadsRepo, dealsRepo);
        const rows = await svc.campaignPerformance();

        expect(Array.isArray(rows)).toBe(true);
        expect(rows[0]).toEqual(expect.objectContaining({ campaign_id: 'c1', leads: 10 }));

        // bảo đảm đủ chain
        expect(qb.select).toHaveBeenCalled();
        expect(qb.addSelect).toHaveBeenCalled();
        expect(qb.groupBy).toHaveBeenCalled();
        expect(qb.orderBy).toHaveBeenCalled();
        expect(qb.getRawMany).toHaveBeenCalled();
    });

    it('campaignPerformance: không có dữ liệu → trả mảng rỗng (cover flow)', async () => {
        const qb = {
            select: jest.fn().mockReturnThis(),
            addSelect: jest.fn().mockReturnThis(),
            groupBy: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getRawMany: jest.fn().mockResolvedValue([]),
        };

        const leadsRepo = { createQueryBuilder: jest.fn().mockReturnValue(qb) } as any;
        const dealsRepo = {} as any;

        const svc = new AnalyticsService(leadsRepo, dealsRepo);
        const rows = await svc.campaignPerformance();

        expect(rows).toEqual([]);
    });
});
