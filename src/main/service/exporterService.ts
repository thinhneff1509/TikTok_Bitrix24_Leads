import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeadEntity } from '../model/entities/leadEntity';

@Injectable()
export class ExporterService {
  constructor(
    @InjectRepository(LeadEntity) private repo: Repository<LeadEntity>,
  ) {}

  async exportCSV(days = 30) {
    const to = new Date();
    const from = new Date(to.getTime() - days * 86400000);
    const rows = await this.repo
      .createQueryBuilder('l')
      .where('l.created_at BETWEEN :from AND :to', { from, to })
      .orderBy('l.created_at', 'DESC')
      .getMany();

    const header = [
      'id',
      'external_id',
      'source',
      'name',
      'email',
      'phone',
      'campaign_id',
      'ad_id',
      'status',
      'created_at',
    ];
    const lines = [header.join(',')];
    for (const r of rows) {
      lines.push(
        [
          r.id,
          r.external_id,
          r.source,
          JSON.stringify(r.name),
          r.email ?? '',
          r.phone ?? '',
          r.campaign_id ?? '',
          r.ad_id ?? '',
          r.status,
          r.created_at.toISOString(),
        ].join(','),
      );
    }
    return lines.join('\n');
  }
}
