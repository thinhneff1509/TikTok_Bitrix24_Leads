import { DealsService } from '../../src/main/service/dealsService';

describe('DealsService (unit)', () => {
  it('upsertFromBitrix: tạo/cập nhật theo external_id bằng upsert()', async () => {
    const payload = {
      id: 'B24_1',
      title: 'Deal',
      amount: 1000,
      currency: 'VND',
    };

    const repo = {
      upsert: jest.fn().mockResolvedValue(undefined),
      findOneByOrFail: jest.fn().mockResolvedValue({
        id: 2,
        external_id: 'B24_1',
        title: 'Deal',
        amount: 1000,
        currency: 'VND',
        raw_data: payload,
      }),
      findAndCount: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    } as any;

    const svc = new DealsService(repo);

    const deal = await svc.upsertFromBitrix(payload);

    expect(repo.upsert).toHaveBeenCalledWith(
      {
        external_id: 'B24_1',
        title: 'Deal',
        amount: 1000,
        currency: 'VND',
        raw_data: payload,
      },
      { conflictPaths: ['external_id'], skipUpdateIfNoValuesChanged: true },
    );
    expect(repo.findOneByOrFail).toHaveBeenCalledWith({ external_id: 'B24_1' });
    expect(deal).toEqual(
      expect.objectContaining({ external_id: 'B24_1', amount: 1000 }),
    );
  });

  it('upsertFromBitrix: thiếu id -> throw', async () => {
    const repo = {
      upsert: jest.fn(),
      findOneByOrFail: jest.fn(),
    } as any;
    const svc = new DealsService(repo);
    await expect(svc.upsertFromBitrix({})).rejects.toThrow(
      'external_id is required',
    );
  });

  it('list: trả về cấu trúc {items,total,page,limit}', async () => {
    const repo = {
      findAndCount: jest.fn().mockResolvedValue([[{ id: 2 }], 1]),
    } as any;
    const svc = new DealsService(repo);
    const res: any = await svc.list({ page: 1, limit: 5 } as any);
    expect(res.total).toBe(1);
    expect(Array.isArray(res.items)).toBe(true);
  });

  it('create: dùng repo.create + repo.save', async () => {
    const repo = {
      create: jest.fn().mockImplementation((x: any) => x),
      save: jest.fn().mockImplementation(async (x: any) => ({ id: 9, ...x })),
    } as any;
    const svc = new DealsService(repo);
    const out = await svc.create({
      title: 'T',
      amount: 1,
      currency: 'VND',
    } as any);
    expect(out.id).toBe(9);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

    it('upsertFromBitrix: lấy external_id từ "id", amount từ "amount", currency từ "currency"', async () => {
        const repo = {
            upsert: jest.fn().mockResolvedValue(undefined),
            findOneByOrFail: jest.fn().mockResolvedValue({ id: 11, external_id: 'B24_1' }),
            findAndCount: jest.fn(),
        } as any;

        const svc = new DealsService(repo);

        const payload = { id: 'B24_1', title: 'Deal', amount: 1000, currency: 'VND' };
        const out = await svc.upsertFromBitrix(payload);

        expect(repo.upsert).toHaveBeenCalledWith(
            expect.objectContaining({ external_id: 'B24_1', title: 'Deal', amount: 1000, currency: 'VND' }),
            expect.objectContaining({ conflictPaths: ['external_id'], skipUpdateIfNoValuesChanged: true }),
        );
        expect(repo.findOneByOrFail).toHaveBeenCalledWith({ external_id: 'B24_1' });
        expect(out).toEqual(expect.objectContaining({ external_id: 'B24_1' }));
    });

    it('upsertFromBitrix: lấy external_id từ "ID" (in hoa), amount từ "OPPORTUNITY", currency từ "CURRENCY_ID"', async () => {
        const repo = {
            upsert: jest.fn().mockResolvedValue(undefined),
            findOneByOrFail: jest.fn().mockResolvedValue({ id: 22, external_id: 'B24_2' }),
        } as any;

        const svc = new DealsService(repo);

        const payload = { ID: 'B24_2', TITLE: 'Bitrix', OPPORTUNITY: '2500', CURRENCY_ID: 'USD' };
        await svc.upsertFromBitrix(payload);

        expect(repo.upsert).toHaveBeenCalledWith(
            expect.objectContaining({ external_id: 'B24_2', title: 'Bitrix', amount: 2500, currency: 'USD' }),
            expect.any(Object),
        );
        expect(repo.findOneByOrFail).toHaveBeenCalledWith({ external_id: 'B24_2' });
    });

    it('upsertFromBitrix: thiếu id/ID → throw 400', async () => {
        const repo = {
            upsert: jest.fn(),
            findOneByOrFail: jest.fn(),
        } as any;

        const svc = new DealsService(repo);
        await expect(svc.upsertFromBitrix({ TITLE: 'No id' } as any)).rejects.toBeTruthy();
        expect(repo.upsert).not.toHaveBeenCalled();
    });

    it('list: trả về đúng shape & phân trang', async () => {
        const repo = {
            findAndCount: jest.fn().mockResolvedValue([[{ id: 1 }], 1]),
        } as any;
        const svc = new DealsService(repo);

        const out: any = await svc.list({ page: 2, limit: 5 } as any);
        expect(out).toEqual(expect.objectContaining({ total: 1, page: 2, limit: 5 }));
        expect(repo.findAndCount).toHaveBeenCalledWith(
            expect.objectContaining({ order: { created_at: 'DESC' }, skip: 5, take: 5 }),
        );
    });
});
