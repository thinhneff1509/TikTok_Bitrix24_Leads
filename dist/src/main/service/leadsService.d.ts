import { Repository } from 'typeorm';
import { LeadEntity } from '../model/entities/leadEntity';
import { ConvertLeadDto, ListLeadsDto } from "../model/dto/leadDto";
import { DealsService } from "./dealsService";
import { BitrixSyncProcessor } from "../jobs/bitrixSyncProcessor";
export declare class LeadsService {
    private repo;
    private readonly deals;
    private readonly jobs;
    constructor(repo: Repository<LeadEntity>, deals: DealsService, jobs: BitrixSyncProcessor);
    list(q: ListLeadsDto): Promise<{
        items: LeadEntity[];
        total: number;
        page: number;
        limit: number;
    }>;
    upsertFromTikTok(data: Partial<LeadEntity>): Promise<LeadEntity>;
    findById(id: string): Promise<LeadEntity>;
    convertToDeal(id: string, body: ConvertLeadDto, probability?: number): Promise<import("../model/entities/dealEntity").DealEntity>;
}
