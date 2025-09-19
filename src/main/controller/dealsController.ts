import { DealsService } from '../service/dealsService';
import { ListDealsDto } from '../model/dto/dealDto';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('api/v1/deals')
export class DealsController {
    constructor(private readonly svc: DealsService) {}

    @Get()
    @ApiOperation({ summary: 'List deals' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiQuery({ name: 'status', required: false, type: String, example: 'open' })
    @ApiQuery({ name: 'assigned_to', required: false, type: String, example: '123' })
    async list(@Query() q: ListDealsDto) {
        return this.svc.list(q);
    }
}
