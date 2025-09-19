export declare class LeadEntity {
    id: string;
    external_id: string;
    source: string;
    name: string;
    email?: string;
    phone?: string;
    campaign_id?: string;
    ad_id?: string;
    raw_data?: any;
    bitrix24_id?: number;
    status: string;
    created_at: Date;
    updated_at: Date;
}
