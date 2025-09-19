import { Global, Module } from '@nestjs/common';
import { BitrixClient } from './bitrixClient';

@Global()
@Module({
    providers: [{ provide: BitrixClient, useFactory: () => new BitrixClient() }],
    exports: [BitrixClient],
})
export class BitrixModule {}
