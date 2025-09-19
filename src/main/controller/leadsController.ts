import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { LeadsService } from '../service/leadsService';
import { ConvertLeadDto, LeadIdParam, ListLeadsDto } from '../model/dto/leadDto';

@ApiTags('Leads')
@Controller('api/v1/leads')
export class LeadsController {
    constructor(private readonly svc: LeadsService) {}

    @Get()
    @ApiOperation({ summary: 'List leads' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiQuery({ name: 'source', required: false, type: String, example: 'tiktok' })
    async list(@Query() q: ListLeadsDto) {
        return this.svc.list(q);
    }

    @Post(':id/convert-to-deal')
    @ApiOperation({ summary: 'Convert a lead to a deal' })
    @ApiParam({
        name: 'id',
        description: 'Lead ID (UUID v4)',
        schema: { type: 'string', format: 'uuid' },
        example: 'ba9d25a5-41a1-42bd-9570-47cf31856dd2',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', example: 'Deal from TikTok' },
                amount: { type: 'number', example: 1000000 },
                currency: { type: 'string', example: 'VND' },
            },
            required: ['title'],
        },
    })
    async convert(@Param() p: LeadIdParam, @Body() body: ConvertLeadDto) {
        return this.svc.convertToDeal(p.id, body, 30);  // 30 = hypothetical user_id, replace have user context
    }
}
