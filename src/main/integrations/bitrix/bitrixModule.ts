import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BitrixClient } from './bitrixClient';

@Global()
@Module({
  imports: [ConfigModule], // ConfigModule isGlobal, import ConfigService
  providers: [
    {
      provide: BitrixClient,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        // Ưu tiên lấy từ ConfigService (env)
        const base = cfg.get<string>('BITRIX_BASE_URL');
        return new BitrixClient(base);
      },
    },
  ],
  exports: [BitrixClient],
})
export class BitrixModule {}
