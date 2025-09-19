import { AnalyticsService } from '../service/analyticsService';
export declare class AnalyticsController {
    private readonly svc;
    constructor(svc: AnalyticsService);
    conv(days?: string): Promise<{
        from: Date;
        to: Date;
        totalLeads: number;
        totalDeals: number;
        rate: number;
    }>;
    perf(): Promise<any[]>;
}
