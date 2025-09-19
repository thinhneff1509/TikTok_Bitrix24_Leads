import { DealsService } from '../service/dealsService';
import { ListDealsDto } from '../model/dto/dealDto';
export declare class DealsController {
    private readonly svc;
    constructor(svc: DealsService);
    list(q: ListDealsDto): Promise<{
        items: import("../model/entities/dealEntity").DealEntity[];
        total: number;
        page: number;
        limit: number;
    }>;
}
