import { Request } from 'express';
import { TikTokService } from '../service/tiktokService';
type RawRequest = Request & {
    rawBody?: Buffer;
};
export declare class TikTokController {
    private readonly svc;
    constructor(svc: TikTokService);
    handleLead(signature: string | undefined, payload: Record<string, any> | undefined, req: RawRequest): Promise<{
        ok: true;
    }>;
}
export {};
