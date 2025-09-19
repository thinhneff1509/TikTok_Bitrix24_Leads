import { Repository } from 'typeorm';
import { LeadEntity } from '../model/entities/leadEntity';
export declare class ExporterService {
    private repo;
    constructor(repo: Repository<LeadEntity>);
    exportCSV(days?: number): Promise<string>;
}
