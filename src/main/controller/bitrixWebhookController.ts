import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DealsService } from '../service/dealsService';

@ApiTags('Bitrix24')
@Controller('webhooks/bitrix24')
export class BitrixWebhookController {
    constructor(private readonly dealsService: DealsService) {}

    @Post('deals')
    @HttpCode(200)
    @ApiOperation({ summary: 'Receive Bitrix24 deal webhook' })
    @ApiBody({
        description: 'Raw payload gửi từ Bitrix24 webhook',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', example: 'B24_12345' },
                title: { type: 'string', example: 'Bitrix deal' },
                amount: { type: 'number', example: 5000000 },
                currency: { type: 'string', example: 'VND' },
                lead_external_id: { type: 'string', example: 'evt_1001' },
                custom_fields: { type: 'object', additionalProperties: true },
            },
        },
    })
    async receiveDeal(@Body() payload: Record<string, any>): Promise<{ ok: true }> {
        await this.dealsService.upsertFromBitrix(payload);
        return { ok: true };
    }
}
