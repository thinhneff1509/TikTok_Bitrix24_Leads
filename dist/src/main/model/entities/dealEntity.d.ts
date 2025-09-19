import { LeadEntity } from './leadEntity';
export declare class DealEntity {
    id: string;
    lead?: LeadEntity | null;
    bitrix24_id?: number;
    title: string;
    amount?: number | null;
    currency: string;
    stage?: string;
    probability: number;
    external_id: string;
    raw_data?: Record<string, any>;
    created_at: Date;
    updated_at: Date;
}
