import { Repository } from 'typeorm';
import { Configuration } from '../model/entities/configEntity';
export declare class ConfigService {
    private readonly repo;
    private cache;
    constructor(repo: Repository<Configuration>);
    getFieldMapping(): Promise<Record<string, string>>;
    setFieldMapping(value: Record<string, string>): Promise<void>;
    getDealRules(): Promise<any[]>;
    setDealRules(value: any[]): Promise<void>;
    private get;
    private set;
}
