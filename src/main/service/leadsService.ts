import { Injectable } from '@nestjs/common';
import {FindOptionsWhere, ILike, Repository} from 'typeorm';
import { LeadEntity } from '../model/entities/leadEntity';
import { InjectRepository } from '@nestjs/typeorm';
import {ConvertLeadDto, ListLeadsDto} from "../model/dto/leadDto";
import {DealsService} from "./dealsService";
import {BitrixSyncProcessor} from "../jobs/bitrixSyncProcessor";

@Injectable()
export class LeadsService {
    constructor(
        @InjectRepository(LeadEntity) private repo: Repository<LeadEntity>,
        private readonly deals: DealsService,
        private readonly jobs: BitrixSyncProcessor,
    ) {}

    async list(q: ListLeadsDto) {
        const where: FindOptionsWhere<LeadEntity> = {};
        if (q.source) where.source = ILike(q.source);
        const [items, total] = await this.repo.findAndCount({
            where, order: { created_at: 'DESC' }, skip: (q.page - 1) * q.limit, take: q.limit,
        });
        return { items, total, page: q.page, limit: q.limit };
    }

    async upsertFromTikTok(data: Partial<LeadEntity>) {
        const found = await this.repo.findOne({
            where: [{ external_id: data.external_id }, { email: data.email ?? '' }, { phone: data.phone ?? '' }],
        });
        if (found) {
            this.repo.merge(found, data, { status: 'updated' });  //If duplicated, it will become edit
            return this.repo.save(found);
        }
        return this.repo.save(this.repo.create(data));
    }

    async findById(id: string) { return this.repo.findOneByOrFail({ id }); }

    async convertToDeal(id: string, body: ConvertLeadDto, probability = 30) {
        const lead = await this.findById(id);
        const title = body.title || `Deal for ${lead.name}`;
        const deal = await this.deals.create({
            title, amount: body.amount, currency: body.currency || 'VND', probability, lead, external_id: `local:${lead.id}`,
        });
        await this.jobs.enqueueDealConversion(lead.id, {
            TITLE: title, OPPORTUNITY: body.amount ?? null, CURRENCY_ID: body.currency || 'VND', PROBABILITY: probability,
        });
        return deal;
    }
}