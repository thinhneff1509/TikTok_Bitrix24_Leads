"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const configService_1 = require("../service/configService");
const configDto_1 = require("../model/dto/configDto");
let ConfigController = class ConfigController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    async getMappings() {
        return this.svc.getFieldMapping();
    }
    async putMappings(payload) {
        await this.svc.setFieldMapping(payload.field_mapping);
        return { ok: true };
    }
    async getRules() {
        return this.svc.getDealRules();
    }
    async putRules(payload) {
        await this.svc.setDealRules(payload.deal_rules);
        return { ok: true };
    }
};
exports.ConfigController = ConfigController;
__decorate([
    (0, common_1.Get)('mappings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get Bitrix24 field mapping' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getMappings", null);
__decorate([
    (0, common_1.Put)('mappings'),
    (0, swagger_1.ApiOperation)({ summary: 'Update Bitrix24 field mapping' }),
    (0, swagger_1.ApiBody)({
        type: configDto_1.FieldMappingPayload,
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
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [configDto_1.FieldMappingPayload]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "putMappings", null);
__decorate([
    (0, common_1.Get)('rules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get deal conversion rules' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getRules", null);
__decorate([
    (0, common_1.Put)('rules'),
    (0, swagger_1.ApiOperation)({ summary: 'Update deal conversion rules' }),
    (0, swagger_1.ApiBody)({
        type: configDto_1.DealRulesPayload,
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
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [configDto_1.DealRulesPayload]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "putRules", null);
exports.ConfigController = ConfigController = __decorate([
    (0, swagger_1.ApiTags)('Config'),
    (0, common_1.Controller)('api/v1/config'),
    __metadata("design:paramtypes", [configService_1.ConfigService])
], ConfigController);
//# sourceMappingURL=configController.js.map