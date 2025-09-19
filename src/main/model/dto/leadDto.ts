import {IsInt, IsOptional, IsString, IsUUID, Min, Max, IsNotEmpty, IsPositive,} from 'class-validator';
import { Type } from 'class-transformer';

export class ListLeadsDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10;

    @IsOptional()
    @IsString()
    source?: string;
}

export class ConvertLeadDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @IsPositive()
    amount?: number;

    @IsOptional()
    @IsString()
    currency?: string;
}

export class LeadIdParam {
    @IsUUID('4')
    id!: string;
}

