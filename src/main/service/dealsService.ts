import {BadRequestException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { DealEntity } from '../model/entities/dealEntity';
import { ListDealsDto } from '../model/dto/dealDto';

@Injectable()
export class DealsService {
    constructor(@InjectRepository(DealEntity) private repo: Repository<DealEntity>) {}

    async list(q: ListDealsDto) {
        const where: FindOptionsWhere<DealEntity> = {};
        const [items, total] = await this.repo.findAndCount({
            where, order: { created_at: 'DESC' }, skip: (q.page - 1) * q.limit, take: q.limit,
        });
        return { items, total, page: q.page, limit: q.limit };
    }

    async create(data: Partial<DealEntity>): Promise<DealEntity> {
        return this.repo.save(this.repo.create(data));
    }

    private async upsertByExternalId(externalId: string, dto: Partial<DealEntity>) {
        if (!externalId) throw new BadRequestException('external_id is required');

        // TypeORM
        await this.repo.upsert(
            { external_id: externalId, ...dto },
            { conflictPaths: ['external_id'], skipUpdateIfNoValuesChanged: true },
        );

        return this.repo.findOneByOrFail({ external_id: externalId });
    }

    async upsertFromBitrix(payload: any) {
        // Map data from Bitrix → internal model
        const externalId = String(payload.id ?? '');
        const data: Partial<DealEntity> = {
            external_id: externalId,
            title: payload.title ?? 'Bitrix deal',
            amount: Number(payload.amount ?? 0) || undefined,
            currency: payload.currency ?? undefined,
            stage: payload.stage ?? undefined,
            raw_data: payload,
        };
        await this.repo.upsert(
            { external_id: externalId },
            { conflictPaths: ['external_id'], skipUpdateIfNoValuesChanged: true },
        );
        // upsert vào DB
        return this.upsertByExternalId(externalId, data);
    }
}
