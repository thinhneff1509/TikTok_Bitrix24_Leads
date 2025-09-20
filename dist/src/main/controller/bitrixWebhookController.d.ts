import { DealsService } from '../service/dealsService';
export declare class BitrixWebhookController {
    private readonly dealsService;
    constructor(dealsService: DealsService);
    receiveDeal(payload: any): Promise<{
        ok: boolean;
        id: string;
        external_id: string;
    }>;
}
