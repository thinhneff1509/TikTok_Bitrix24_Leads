import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
} from 'class-validator';

/** Payload PUT /api/v1/config/mappings */
export class FieldMappingPayload {
    @IsObject()
    @IsNotEmpty()
    field_mapping!: Record<string, string>;
}

/** Một rule tạo deal */
export class DealRuleDto {
    @IsString() condition!: string;             // ví dụ: "campaign.campaign_name CONTAINS 'sale'"
    @IsString() action!: 'create_deal';         // hiện tại chỉ 1 action
    @IsString() pipeline_id!: string;           // "1"
    @IsString() stage_id!: string;              // "NEW"
    @IsInt() @Min(0) @Type(() => Number) probability!: number; // 0..100
    @IsOptional() @IsInt() @Type(() => Number) assign_user_id?: number;
}

/** Payload PUT /api/v1/config/rules  (mảng rule) */
export class DealRulesPayload {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DealRuleDto)
    deal_rules!: DealRuleDto[];
}
