import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadEntity } from '../model/entities/leadEntity';
import { LeadsService } from '../service/leadsService';
import { LeadsController } from '../controller/leadsController';
import { DealsModule } from './dealsModule';
import { ConfigStoreModule } from './configStoreModule';
import { JobsModule } from '../jobs/jobsModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeadEntity]),
    forwardRef(() => DealsModule),
    ConfigStoreModule,
    JobsModule,
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}
