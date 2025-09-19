import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ListDealsDto {
    @IsInt() @Min(1) page = 1;
    @IsInt() @Min(1) limit = 10;
    @IsOptional() @IsString() status?: string;
    @IsOptional() @IsString() assigned_to?: string;
}
