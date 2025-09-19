export declare class ListLeadsDto {
    page: number;
    limit: number;
    source?: string;
}
export declare class ConvertLeadDto {
    title: string;
    amount?: number;
    currency?: string;
}
export declare class LeadIdParam {
    id: string;
}
export declare enum LeadStatus {
    NEW = "new",
    UPDATED = "updated"
}
