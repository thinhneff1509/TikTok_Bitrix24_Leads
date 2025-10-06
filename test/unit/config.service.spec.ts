import { ConfigService } from '../../src/main/service/configService';

type RepoMock = {
    findOne: jest.Mock;
    upsert: jest.Mock;
};

function makeRepo(): RepoMock {
    return {
        findOne: jest.fn(),
        upsert: jest.fn().mockResolvedValue(undefined),
    };
}

describe('ConfigService (unit)', () => {
    let repo: RepoMock;
    let svc: ConfigService;

    const nowSpy = jest.spyOn(Date, 'now');

    beforeEach(() => {
        repo = makeRepo();
        svc = new ConfigService(repo as any);
        nowSpy.mockReturnValue(1_000);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('getFieldMapping: trả về fallback khi chưa có trong DB và cache lại', async () => {
        repo.findOne.mockResolvedValue(null);

        const m1 = await svc.getFieldMapping();
        expect(m1).toEqual({});
        expect(repo.findOne).toHaveBeenCalledWith({ where: { key: 'field_mapping' } });

        repo.findOne.mockClear();
        const m2 = await svc.getFieldMapping();
        expect(m2).toEqual({});
        expect(repo.findOne).not.toHaveBeenCalled();
    });

    it('setFieldMapping: upsert đúng shape và cập nhật cache', async () => {
        const value = { 'lead_data.email': 'EMAIL[0][VALUE]' };
        await svc.setFieldMapping(value);

        expect(repo.upsert).toHaveBeenCalledWith({ key: 'field_mapping', value }, ['key']);

        repo.findOne.mockClear();
        const got = await svc.getFieldMapping();
        expect(got).toEqual(value);
        expect(repo.findOne).not.toHaveBeenCalled();
    });

    it('getDealRules: trả về [] theo fallback và được cache', async () => {
        repo.findOne.mockResolvedValue(null);

        const r1 = await svc.getDealRules();
        expect(r1).toEqual([]);
        expect(repo.findOne).toHaveBeenCalledWith({ where: { key: 'deal_rules' } });

        repo.findOne.mockClear();
        const r2 = await svc.getDealRules();
        expect(r2).toEqual([]);
        expect(repo.findOne).not.toHaveBeenCalled();
    });

    it('setDealRules: upsert đúng shape và cập nhật cache', async () => {
        const rules = [
            { condition: "source == 'tiktok'", action: 'create_deal', pipeline_id: '1', stage_id: 'NEW', probability: 30 },
        ];
        await svc.setDealRules(rules);

        expect(repo.upsert).toHaveBeenCalledWith({ key: 'deal_rules', value: rules }, ['key']);

        repo.findOne.mockClear();
        const r2 = await svc.getDealRules();
        expect(r2).toEqual(rules);
        expect(repo.findOne).not.toHaveBeenCalled();
    });

    it('TTL cache 60s: hết hạn sẽ đọc lại DB', async () => {
        repo.findOne.mockResolvedValue({ key: 'field_mapping', value: { a: 'b' } });
        const first = await svc.getFieldMapping();
        expect(first).toEqual({ a: 'b' });
        expect(repo.findOne).toHaveBeenCalledTimes(1);

        repo.findOne.mockClear();
        nowSpy.mockReturnValue(1_000 + 30_000); // +30s
        await svc.getFieldMapping();
        expect(repo.findOne).not.toHaveBeenCalled();

        repo.findOne.mockResolvedValue({ key: 'field_mapping', value: { c: 'd' } });
        nowSpy.mockReturnValue(1_000 + 60_000 + 1); // >60s
        const afterTtl = await svc.getFieldMapping();
        expect(afterTtl).toEqual({ c: 'd' });
        expect(repo.findOne).toHaveBeenCalledTimes(1);
    });
});
