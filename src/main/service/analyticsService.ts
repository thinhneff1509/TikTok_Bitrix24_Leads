import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { LeadEntity } from '../model/entities/leadEntity';
import { DealEntity } from '../model/entities/dealEntity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(LeadEntity) private leads: Repository<LeadEntity>,
    @InjectRepository(DealEntity) private deals: Repository<DealEntity>,
  ) {}

  async conversionRates(days = 30) {
    const to = new Date();
    const from = new Date(to.getTime() - days * 86400000);
    const totalLeads = await this.leads.count({
      where: { created_at: Between(from, to) },
    });
    const totalDeals = await this.deals.count({
      where: { created_at: Between(from, to) },
    });
    return {
      from,
      to,
      totalLeads,
      totalDeals,
      rate: totalLeads ? +((totalDeals / totalLeads) * 100).toFixed(2) : 0,
    };
  }

  async campaignPerformance() {
    // group by campaign_id
    const qb = this.leads
      .createQueryBuilder('l')
      .select('l.campaign_id', 'campaign_id')
      .addSelect('COUNT(*)::int', 'leads')
      .groupBy('l.campaign_id')
      .orderBy('leads', 'DESC');
    const rows = await qb.getRawMany();
    return rows;
  }
}
