import { DealsService } from '../service/dealsService';
export declare class BitrixWebhookController {
    private readonly dealsService;
    constructor(dealsService: DealsService);
    receiveDeal(payload: Record<string, any>): Promise<{
        ok: true;
    }>;
}
