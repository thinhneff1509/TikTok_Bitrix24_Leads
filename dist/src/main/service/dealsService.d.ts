import { Repository } from 'typeorm';
import { DealEntity } from '../model/entities/dealEntity';
import { ListDealsDto } from '../model/dto/dealDto';
export declare class DealsService {
    private repo;
    constructor(repo: Repository<DealEntity>);
    list(q: ListDealsDto): Promise<{
        items: DealEntity[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(data: Partial<DealEntity>): Promise<DealEntity>;
    private upsertByExternalId;
    upsertFromBitrix(payload: any): Promise<DealEntity>;
}
