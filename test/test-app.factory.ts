import {
  INestApplication,
  ValidationPipe,
  RequestMethod,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

import { TikTokService } from '../src/main/service/tiktokService';
import { BitrixSyncProcessor } from '../src/main/jobs/bitrixSyncProcessor';
import { LeadsService } from '../src/main/service/leadsService';
import { DealsService } from '../src/main/service/dealsService';
import { ConfigService } from '../src/main/service/configService';
import { AnalyticsService } from '../src/main/service/analyticsService';
import { ExporterService } from '../src/main/service/exporterService';

// Fakes
class TikTokServiceFake {
  processWebhook = jest
    .fn()
    .mockResolvedValue({ ok: true, lead: { id: 'fake' } });
}
class BitrixSyncProcessorFake {
  enqueueLeadSync = jest.fn().mockResolvedValue(undefined);
  enqueueDealConversion = jest.fn().mockResolvedValue(undefined);
}
class LeadsServiceFake {
  list = jest.fn().mockImplementation(async (q: any) => ({
    items: [],
    total: 0,
    page: q?.page ?? 1,
    limit: q?.limit ?? 10,
  }));
  convertToDeal = jest
    .fn()
    .mockResolvedValue({ id: 'deal_1', title: 'Deal X' });
}
class DealsServiceFake {
  list = jest.fn().mockImplementation(async (q: any) => ({
    items: [],
    total: 0,
    page: q?.page ?? 1,
    limit: q?.limit ?? 10,
  }));
  upsertFromBitrix = jest
    .fn()
    .mockResolvedValue({ id: 1, external_id: 'B24_12345' });
  create = jest.fn().mockResolvedValue({ id: 99 });
}
class ConfigServiceFake {
  private mapping: Record<string, string> = {
    'lead_data.email': 'EMAIL[0][VALUE]',
  };
  private rules: any[] = [
    {
      condition: "source == 'tiktok'",
      action: 'create_deal',
      pipeline_id: '1',
      stage_id: 'NEW',
      probability: 30,
    },
  ];

  getFieldMapping = jest
    .fn()
    .mockImplementation(async () => ({ ...this.mapping }));
  updateFieldMapping = jest.fn().mockImplementation(async (body: any) => {
    const m = body?.field_mapping ?? body ?? {};
    this.mapping = { ...this.mapping, ...m };
    return true;
  });

  getConversionRules = jest.fn().mockImplementation(async () => this.rules);
  updateConversionRules = jest.fn().mockImplementation(async (body: any) => {
    this.rules = body?.deal_rules ?? body ?? [];
    return true;
  });
}
class AnalyticsServiceFake {
  getConversionRates = jest
    .fn()
    .mockResolvedValue({ totalLeads: 100, totalDeals: 25, rate: 25 });
  conversionRates = this.getConversionRates;
  getCampaignPerformance = jest
    .fn()
    .mockResolvedValue([{ campaign_id: 'c1', leads: 10 }]);
  campaignPerformance = this.getCampaignPerformance;
}
class ExporterServiceFake {
  exportCSV = jest.fn().mockResolvedValue('id,external_id\n1,evt_1');
  export = this.exportCSV;
}

export async function createTestApp(): Promise<INestApplication> {
  process.env.NODE_ENV = 'test';
  process.env.SKIP_SIGNATURE_VERIFY = '1';

  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(TikTokService)
    .useClass(TikTokServiceFake)
    .overrideProvider(BitrixSyncProcessor)
    .useClass(BitrixSyncProcessorFake)
    .overrideProvider(LeadsService)
    .useClass(LeadsServiceFake)
    .overrideProvider(DealsService)
    .useClass(DealsServiceFake)
    .overrideProvider(ConfigService)
    .useClass(ConfigServiceFake)
    .overrideProvider(AnalyticsService)
    .useClass(AnalyticsServiceFake)
    .overrideProvider(ExporterService)
    .useClass(ExporterServiceFake)
    .compile();

  const app = moduleRef.createNestApplication();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.setGlobalPrefix('api/v1', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: 'webhooks', method: RequestMethod.ALL },
      { path: 'webhooks/(.*)', method: RequestMethod.ALL },
    ],
  });

  await app.init();
  return app;
}
