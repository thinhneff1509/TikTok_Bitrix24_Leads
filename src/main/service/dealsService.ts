import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { DealEntity } from '../model/entities/dealEntity';
import { ListDealsDto } from '../model/dto/dealDto';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(DealEntity) private repo: Repository<DealEntity>,
  ) {}

  async list(q: ListDealsDto) {
    const where: FindOptionsWhere<DealEntity> = {};
    const [items, total] = await this.repo.findAndCount({
      where,
      order: { created_at: 'DESC' },
      skip: (q.page - 1) * q.limit,
      take: q.limit,
    });
    return { items, total, page: q.page, limit: q.limit };
  }

  async create(data: Partial<DealEntity>): Promise<DealEntity> {
    return this.repo.save(this.repo.create(data));
  }

  private async upsertByExternalId(
    externalId: string,
    dto: Partial<DealEntity>,
  ) {
    if (!externalId) throw new BadRequestException('external_id is required');

    // TypeORM
    await this.repo.upsert(
      { external_id: externalId, ...dto },
      { conflictPaths: ['external_id'], skipUpdateIfNoValuesChanged: true },
    );

    return this.repo.findOneByOrFail({ external_id: externalId });
  }

  async upsertFromBitrix(payload: any) {
    // Map data from Bitrix
    const externalId = String(payload.id ?? payload.ID ?? '');
    if (!externalId) {
      throw new BadRequestException('external_id is required');
    }

    const amount =
      payload.amount !== undefined
        ? Number(payload.amount)
        : payload.OPPORTUNITY !== undefined
          ? Number(payload.OPPORTUNITY)
          : undefined;

    const data: Partial<DealEntity> = {
      title: payload.title ?? payload.TITLE ?? 'Bitrix deal',
      amount,
      currency: payload.currency ?? payload.CURRENCY_ID ?? undefined,
      raw_data: payload, // save to debug
    };

    return this.upsertByExternalId(externalId, data);
  }
}
