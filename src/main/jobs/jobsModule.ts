import { Global, Module } from '@nestjs/common';
import { BitrixSyncProcessor } from './bitrixSyncProcessor';
import { BitrixModule } from '../integrations';

@Global()
@Module({
    imports: [BitrixModule],
    providers: [BitrixSyncProcessor],
    exports: [BitrixSyncProcessor],
})
export class JobsModule {}
