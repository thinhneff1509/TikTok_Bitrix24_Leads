import { LeadsService } from './leadsService';
import { ConfigService } from './configService';
import { BitrixSyncProcessor } from '../jobs/bitrixSyncProcessor';
export declare class TikTokService {
    private readonly leads;
    private readonly cfg;
    private readonly jobs;
    private readonly logger;
    private readonly skipVerify;
    constructor(leads: LeadsService, cfg: ConfigService, jobs: BitrixSyncProcessor);
    processWebhook(sig: string | undefined, payload: any, rawBody?: Buffer): Promise<{
        ok: true;
        lead: any;
    }>;
}
