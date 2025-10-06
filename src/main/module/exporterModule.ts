import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadEntity } from '../model/entities/leadEntity';
import { ExporterController } from '../controller/exporterController';
import { ExporterService } from '../service/exporterService';

@Module({
  imports: [TypeOrmModule.forFeature([LeadEntity])],
  controllers: [ExporterController],
  providers: [ExporterService],
})
export class ExporterModule {}
