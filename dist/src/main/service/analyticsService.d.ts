import { Repository } from 'typeorm';
import { LeadEntity } from '../model/entities/leadEntity';
import { DealEntity } from '../model/entities/dealEntity';
export declare class AnalyticsService {
    private leads;
    private deals;
    constructor(leads: Repository<LeadEntity>, deals: Repository<DealEntity>);
    conversionRates(days?: number): Promise<{
        from: Date;
        to: Date;
        totalLeads: number;
        totalDeals: number;
        rate: number;
    }>;
    campaignPerformance(): Promise<any[]>;
}
