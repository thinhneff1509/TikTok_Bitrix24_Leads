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
exports.BitrixWebhookController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dealsService_1 = require("../service/dealsService");
let BitrixWebhookController = class BitrixWebhookController {
    dealsService;
    constructor(dealsService) {
        this.dealsService = dealsService;
    }
    async receiveDeal(payload) {
        const deal = await this.dealsService.upsertFromBitrix(payload);
        return { ok: true, id: deal.id, external_id: deal.external_id };
    }
};
exports.BitrixWebhookController = BitrixWebhookController;
__decorate([
    (0, common_1.Post)('deals'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Receive Bitrix24 deal webhook' }),
    (0, swagger_1.ApiBody)({
        description: 'Raw payload from Bitrix24',
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
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BitrixWebhookController.prototype, "receiveDeal", null);
exports.BitrixWebhookController = BitrixWebhookController = __decorate([
    (0, swagger_1.ApiTags)('Bitrix24'),
    (0, common_1.Controller)('webhooks/bitrix24'),
    __metadata("design:paramtypes", [dealsService_1.DealsService])
], BitrixWebhookController);
//# sourceMappingURL=bitrixWebhookController.js.map