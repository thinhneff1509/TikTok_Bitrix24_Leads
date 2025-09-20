export declare class FieldMappingPayload {
    field_mapping: Record<string, string>;
}
export declare class DealRuleDto {
    condition: string;
    action: 'create_deal';
    pipeline_id: string;
    stage_id: string;
    probability: number;
    assign_user_id?: number;
}
export declare class DealRulesPayload {
    deal_rules: DealRuleDto[];
}
