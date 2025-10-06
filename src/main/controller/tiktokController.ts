import { Body, Controller, Headers, HttpCode, Post, Req } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { TikTokService } from '../service/tiktokService';

// rawBody must Buffer
type RawRequest = Request & { rawBody?: Buffer };

@ApiTags('TikTok')
@Controller('webhooks/tiktok')
export class TikTokController {
  constructor(private readonly svc: TikTokService) {}

  @Post('leads')
  @HttpCode(200)
  @ApiOperation({ summary: 'Receive TikTok lead webhook' })
  @ApiHeader({
    name: 'tiktok-signature',
    required: true,
    description: 'Base64 in RawBody, key = TIKTOK_WEBHOOK_SECRET',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        event_id: { type: 'string', example: 'evt_1001' },
        lead_data: {
          type: 'object',
          properties: {
            full_name: { type: 'string', example: 'Le Truong Thinh' },
            email: { type: 'string', example: 'nguyenvana@example.com' },
            phone: { type: 'string', example: '+84901234567' },
          },
        },
        campaign: {
          type: 'object',
          properties: {
            campaign_id: { type: 'string', example: 'cmp_111' },
            ad_id: { type: 'string', example: 'ad_222' },
          },
        },
      },
      required: ['event_id', 'lead_data'],
    },
  })
  async handleLead(
    @Headers('tiktok-signature') signature: string | undefined,
    @Body() payload: Record<string, any> = {},
    @Req() req: RawRequest,
  ): Promise<{ ok: true }> {
    const raw = req.rawBody;
    await this.svc.processWebhook(signature, payload, raw);
    return { ok: true };
  }
}
