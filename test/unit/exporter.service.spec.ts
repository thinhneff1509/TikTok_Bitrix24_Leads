import { ExporterService } from '../../src/main/service/exporterService';

describe('ExporterService (unit)', () => {

  it('exportCSV() xuất CSV đúng header & số dòng', async () => {
    const rows = [
      {
        id: 1,
        external_id: 'evt_1',
        source: 'tiktok',
        name: 'A',
        email: 'a@ex.com',
        phone: '+84901',
        campaign_id: 'c1',
        ad_id: 'a1',
        status: 'new',
        created_at: new Date('2025-01-01T00:00:00.000Z'),
      },
      {
        id: 2,
        external_id: 'evt_2',
        source: 'tiktok',
        name: 'B',
        email: 'b@ex.com',
        phone: '+84902',
        campaign_id: 'c1',
        ad_id: 'a2',
        status: 'updated',
        created_at: new Date('2025-01-02T00:00:00.000Z'),
      },
    ];

    const qb = {
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(rows),
    };

    const repo = {
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    } as any;

    const svc = new ExporterService(repo);

    const csv = await svc.exportCSV(7);
    const lines = csv.trim().split('\n');

    expect(lines[0]).toBe(
      'id,external_id,source,name,email,phone,campaign_id,ad_id,status,created_at',
    );

    expect(lines.length).toBe(1 + rows.length);

    expect(csv).toContain(',');

    expect(repo.createQueryBuilder).toHaveBeenCalledWith('l');
    expect(qb.where).toHaveBeenCalled();
    expect(qb.orderBy).toHaveBeenCalledWith('l.created_at', 'DESC');
  });

  it('exportCSV() với dataset rỗng vẫn trả về header', async () => {
    const qb = {
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };
    const repo = { createQueryBuilder: jest.fn().mockReturnValue(qb) } as any;

    const svc = new ExporterService(repo);
    const csv = await svc.exportCSV(30);
    const lines = csv.trim().split('\n');

    expect(lines[0]).toBe(
      'id,external_id,source,name,email,phone,campaign_id,ad_id,status,created_at',
    );
    expect(lines.length).toBe(1);
  });


    it('exportCSV với dataset rỗng trả về chỉ header', async () => {
        const qb = {
            where: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue([]),
        };
        const repo = { createQueryBuilder: jest.fn().mockReturnValue(qb) } as any;

        const svc = new ExporterService(repo);
        const csv = await svc.exportCSV(1);
        const lines = csv.trim().split('\n');

        expect(lines).toHaveLength(1);
        expect(lines[0]).toContain('external_id');
    });

    it('exportCSV với 1 row trả về 2 dòng (header + row)', async () => {
        const now = new Date();
        const rows = [{
            id: '1', external_id: 'evt_1', source: 'tiktok', name: 'A',
            email: 'a@ex.com', phone: '84', campaign_id: 'c1', ad_id: 'a1',
            status: 'new', created_at: now,
        }];
        const qb = {
            where: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue(rows),
        };
        const repo = { createQueryBuilder: jest.fn().mockReturnValue(qb) } as any;

        const svc = new ExporterService(repo);
        const csv = await svc.exportCSV(7);
        const lines = csv.trim().split('\n');

        expect(lines.length).toBe(2);
        expect(lines[1]).toContain('evt_1');
    });

    const header =
        'id,external_id,source,name,email,phone,campaign_id,ad_id,status,created_at';

    it('exportCSV: dataset rỗng → chỉ có header', async () => {
        const qb = {
            where: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue([]),
        };
        const repo = { createQueryBuilder: jest.fn().mockReturnValue(qb) } as any;

        const svc = new ExporterService(repo);
        const csv = await svc.exportCSV(1);
        const lines = csv.trim().split('\n');

        expect(lines).toHaveLength(1);
        expect(lines[0]).toBe(header);
    });

    it('exportCSV: có đủ field → đi nhánh có giá trị (không dùng fallback)', async () => {
        const created = new Date('2024-01-01T00:00:00.000Z');
        const rows = [
            {
                id: '1',
                external_id: 'evt_1',
                source: 'tiktok',
                name: 'A',
                email: 'a@ex.com',
                phone: '84',
                campaign_id: 'c1',
                ad_id: 'a1',
                status: 'new',
                created_at: created,
            },
        ];
        const qb = {
            where: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue(rows),
        };
        const repo = { createQueryBuilder: jest.fn().mockReturnValue(qb) } as any;

        const svc = new ExporterService(repo);
        const csv = await svc.exportCSV(7);
        const lines = csv.trim().split('\n');

        expect(lines[0]).toBe(header);
        expect(lines[1]).toContain('evt_1');
        expect(lines[1]).toContain('"A"');
        expect(lines[1]).toContain(created.toISOString());
    });

    it('exportCSV: thiếu email/phone/campaign_id/ad_id → đi nhánh fallback ""', async () => {
        const created = new Date('2024-02-02T02:00:00.000Z');
        const rows = [
            {
                id: '2',
                external_id: 'evt_2',
                source: 'tiktok',
                name: 'B',
                email: undefined,
                phone: undefined,
                campaign_id: undefined,
                ad_id: undefined,
                status: 'updated',
                created_at: created,
            },
        ];
        const qb = {
            where: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue(rows),
        };
        const repo = { createQueryBuilder: jest.fn().mockReturnValue(qb) } as any;

        const svc = new ExporterService(repo);
        const csv = await svc.exportCSV(30);
        const lines = csv.trim().split('\n');

        // Dòng data sẽ có 4 field rỗng liên tiếp (email,phone,campaign_id,ad_id)
        expect(lines[1]).toMatch(/^2,evt_2,tiktok,"B",,,,,updated,2024-02-02T02:00:00.000Z$/);
    });
});
