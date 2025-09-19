import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealEntity } from '../model/entities/dealEntity';
import { DealsService } from '../service/dealsService';
import { DealsController } from '../controller/dealsController';

@Module({
    imports: [TypeOrmModule.forFeature([DealEntity])],
    controllers: [DealsController],
    providers: [DealsService],
    exports: [DealsService],
})
export class DealsModule {}
