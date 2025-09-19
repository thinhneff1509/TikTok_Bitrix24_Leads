import { OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { BitrixClient } from '../integrations';
export declare enum BitrixJob {
    CREATE_OR_UPDATE_LEAD = "b24:createOrUpdateLead",
    CONVERT_TO_DEAL = "b24:convertToDeal"
}
export declare class BitrixSyncProcessor implements OnModuleInit {
    private readonly bitrix;
    private readonly connection;
    private readonly queueOpts;
    readonly queue: Queue<any, any, string>;
    constructor(bitrix: BitrixClient);
    onModuleInit(): Promise<void>;
    enqueueLeadSync(externalId: string, fields: any): Promise<import("bullmq").Job<any, any, string>>;
    enqueueDealConversion(leadId: string, fields: any): Promise<import("bullmq").Job<any, any, string>>;
}
