import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration } from '../model/entities/configEntity';

@Injectable()
export class ConfigService {
    private cache: Record<string, { at: number; data: any }> = {};
    constructor(@InjectRepository(Configuration) private repo: Repository<Configuration>) {}

    async getFieldMapping() {
        const c = this.cache['field_mapping'];
        if (c && Date.now() - c.at < 60_000) return c.data; // TTL 60s
        const data = (await this.repo.findOneBy({ key: 'field_mapping' }))?.value ?? {};
        this.cache['field_mapping'] = { at: Date.now(), data };
        return data;
    }
    async setFieldMapping(value: any) { await this.repo.upsert({ key: 'field_mapping', value }, ['key']); }

    async getDealRules() { return (await this.repo.findOneBy({ key: 'deal_rules' }))?.value ?? []; }
    async setDealRules(value: any[]) { await this.repo.upsert({ key: 'deal_rules', value }, ['key']); }
}
