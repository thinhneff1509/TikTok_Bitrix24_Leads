import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '../service/configService';
import { DealRulesPayload, FieldMappingPayload } from '../model/dto/configDto';

@ApiTags('Config')
@Controller('config')
export class ConfigController {
  constructor(private readonly svc: ConfigService) {}

  // ----- Field mapping -----
  @Get('mappings')
  @ApiOperation({ summary: 'Get Bitrix24 field mapping' })
  async getMappings() {
    return this.svc.getFieldMapping();
  }

  @Put('mappings')
  @ApiOperation({ summary: 'Update Bitrix24 field mapping' })
  @ApiBody({
    type: FieldMappingPayload,
    examples: {
      sample: {
        value: {
          field_mapping: {
            'lead_data.full_name': 'NAME',
            'lead_data.email': 'letruongthinh@gmail.com',
            'lead_data.phone': '8467811672',
            'lead_data.city': 'HN_CITY',
            'campaign.campaign_name': 'Thinh_CAMPAIGN',
            'campaign.ad_name': 'AD_Thinh',
            'lead_data.ttclid': 'UF_CRM_TTCLID',
          },
        },
      },
    },
  })
  async putMappings(@Body() payload: FieldMappingPayload) {
    await this.svc.setFieldMapping(payload.field_mapping);
    return { ok: true };
  }

  // ----- Deal rules -----
  @Get('rules')
  @ApiOperation({ summary: 'Get deal conversion rules' })
  async getRules() {
    return this.svc.getDealRules();
  }

  @Put('rules')
  @ApiOperation({ summary: 'Update deal conversion rules' })
  @ApiBody({
    type: DealRulesPayload,
    examples: {
      sample: {
        value: {
          deal_rules: [
            {
              condition: "campaign.campaign_name CONTAINS 'sale'",
              action: 'create_deal',
              pipeline_id: '1',
              stage_id: 'NEW',
              probability: 30,
            },
          ],
        },
      },
    },
  })
  async putRules(@Body() payload: DealRulesPayload) {
    await this.svc.setDealRules(payload.deal_rules);
    return { ok: true };
  }
}
