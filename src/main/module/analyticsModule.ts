import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadEntity } from '../model/entities/leadEntity';
import { DealEntity } from '../model/entities/dealEntity';
import { AnalyticsController } from '../controller/analyticsController';
import { AnalyticsService } from '../service/analyticsService';

@Module({
    imports: [TypeOrmModule.forFeature([LeadEntity, DealEntity])],
    controllers: [AnalyticsController],
    providers: [AnalyticsService],
})
export class AnalyticsModule {}
