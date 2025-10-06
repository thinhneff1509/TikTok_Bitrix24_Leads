import { Controller, Get, Header, Query } from '@nestjs/common';
import { ExporterService } from '../service/exporterService';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Exporter')
@Controller('reports')
export class ExporterController {
  constructor(private readonly svc: ExporterService) {}

  @Get('export')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="leads.csv"')
  async export(@Query('date_range') dr?: string) {
    const days = dr?.endsWith('d') ? Number(dr.slice(0, -1)) : 30;
    return this.svc.exportCSV(days);
  }
}
