import { ConfigService } from '../service/configService';
import { DealRulesPayload, FieldMappingPayload } from '../model/dto/configDto';
export declare class ConfigController {
    private readonly svc;
    constructor(svc: ConfigService);
    getMappings(): Promise<Record<string, string>>;
    putMappings(payload: FieldMappingPayload): Promise<{
        ok: boolean;
    }>;
    getRules(): Promise<any[]>;
    putRules(payload: DealRulesPayload): Promise<{
        ok: boolean;
    }>;
}
