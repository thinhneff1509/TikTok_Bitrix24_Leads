import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration } from '../model/entities/configEntity';

type CacheCell<T> = { at: number; data: T };

@Injectable()
export class ConfigService {
  private cache: Record<string, CacheCell<any>> = {};

  constructor(
    @InjectRepository(Configuration)
    private readonly repo: Repository<Configuration>,
  ) {}

  // ====== Field mapping ======
  async getFieldMapping(): Promise<Record<string, string>> {
    return this.get<Record<string, string>>('field_mapping', {});
  }

  async setFieldMapping(value: Record<string, string>): Promise<void> {
    await this.set('field_mapping', value);
  }

  // ====== Deal rules (mảng rule) ======
  async getDealRules(): Promise<any[]> {
    return this.get<any[]>('deal_rules', []);
  }

  async setDealRules(value: any[]): Promise<void> {
    await this.set('deal_rules', value);
  }

  // ====== helpers có cache TTL 60s ======
  private async get<T>(key: string, fallback: T): Promise<T> {
    const cell = this.cache[key];
    if (cell && Date.now() - cell.at < 60_000) return cell.data as T;

    const row = await this.repo.findOne({ where: { key } });
    const data = (row?.value ?? fallback) as T;
    this.cache[key] = { at: Date.now(), data };
    return data;
  }

  private async set(key: string, value: any): Promise<void> {
    // Đưa đúng shape cho TypeORM
    await this.repo.upsert({ key, value }, ['key']);
    this.cache[key] = { at: Date.now(), data: value };
  }
}
