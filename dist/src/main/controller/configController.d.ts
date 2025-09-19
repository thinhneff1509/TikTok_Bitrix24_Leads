import { ConfigService } from '../service/configService';
export declare class ConfigController {
    private readonly svc;
    constructor(svc: ConfigService);
    getMappings(): Promise<any>;
    putMappings(body: any): Promise<{
        ok: boolean;
    }>;
    getRules(): Promise<any>;
    putRules(body: any[]): Promise<{
        ok: boolean;
    }>;
}
