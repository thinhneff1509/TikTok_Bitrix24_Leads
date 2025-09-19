import { LeadsService } from '../service/leadsService';
import { ConvertLeadDto, LeadIdParam, ListLeadsDto } from '../model/dto/leadDto';
export declare class LeadsController {
    private readonly svc;
    constructor(svc: LeadsService);
    list(q: ListLeadsDto): Promise<{
        items: import("../model/entities/leadEntity").LeadEntity[];
        total: number;
        page: number;
        limit: number;
    }>;
    convert(p: LeadIdParam, body: ConvertLeadDto): Promise<import("../model/entities/dealEntity").DealEntity>;
}
