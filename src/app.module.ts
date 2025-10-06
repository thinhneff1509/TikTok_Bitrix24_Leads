import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HttpExceptionFilter } from './main/common/filters/httpExceptionFilter';
import { LoggingInterceptor } from './main/common/interceptors/loggingInterceptor';

import { ConfigStoreModule } from './main/module/configStoreModule';
import { AnalyticsModule } from './main/module/analyticsModule';
import { ExporterModule } from './main/module/exporterModule';

import { BitrixModule } from './main/integrations';
import { JobsModule } from './main/jobs/jobsModule';

import { TikTokController } from './main/controller/tiktokController';
import { BitrixWebhookController } from './main/controller/bitrixWebhookController';
import { HealthController } from './main/controller/healthController';
import { TikTokService } from './main/service/tiktokService';
import { ThrottlerModule } from '@nestjs/throttler';
import { LeadsModule } from './main/module/leadsModule';
import { DealsModule } from './main/module/dealsModule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Rate limit cho toàn app
    ThrottlerModule.forRoot([{ ttl: 60, limit: 120 }]),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'postgres',
        database: process.env.DB_NAME || 'tiktok_b24',
        autoLoadEntities: true,
        synchronize: false, // use migrations
      }),
    }),
    LeadsModule,
    DealsModule,
    ConfigStoreModule,
    AnalyticsModule,
    ExporterModule,
    BitrixModule,
    JobsModule,
  ],
  controllers: [TikTokController, BitrixWebhookController, HealthController],
  providers: [
    TikTokService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
