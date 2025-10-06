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

export class FieldMappingPayload {
  @IsObject()
  @IsNotEmpty()
  field_mapping!: Record<string, string>;
}

export class DealRuleDto {
  @IsString() condition!: string;
  @IsString() action!: 'create_deal';
  @IsString() pipeline_id!: string;
  @IsString() stage_id!: string;
  @IsInt() @Min(0) @Type(() => Number) probability!: number;
  @IsOptional() @IsInt() @Type(() => Number) assign_user_id?: number;
}

export class DealRulesPayload {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DealRuleDto)
  deal_rules!: DealRuleDto[];
}
