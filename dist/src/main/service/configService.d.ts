import { Repository } from 'typeorm';
import { Configuration } from '../model/entities/configEntity';
export declare class ConfigService {
    private repo;
    private cache;
    constructor(repo: Repository<Configuration>);
    getFieldMapping(): Promise<any>;
    setFieldMapping(value: any): Promise<void>;
    getDealRules(): Promise<any>;
    setDealRules(value: any[]): Promise<void>;
}
