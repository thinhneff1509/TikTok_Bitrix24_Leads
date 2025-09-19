import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from '../service/analyticsService';

@Controller('api/v1/analytics')
export class AnalyticsController {
    constructor(private readonly svc: AnalyticsService) {}

    @Get('conversion-rates')
    async conv(@Query('days') days?: string) {
        return this.svc.conversionRates(Number(days) || 30);
    }

    @Get('campaign-performance')
    async perf() {
        return this.svc.campaignPerformance();
    }
}
