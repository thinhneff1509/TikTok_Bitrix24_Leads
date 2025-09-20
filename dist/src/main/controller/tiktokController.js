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
exports.TikTokController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tiktokService_1 = require("../service/tiktokService");
let TikTokController = class TikTokController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    async handleLead(signature, payload = {}, req) {
        const raw = req.rawBody;
        await this.svc.processWebhook(signature, payload, raw);
        return { ok: true };
    }
};
exports.TikTokController = TikTokController;
__decorate([
    (0, common_1.Post)('leads'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Receive TikTok lead webhook' }),
    (0, swagger_1.ApiHeader)({
        name: 'tiktok-signature',
        required: true,
        description: 'Base64 in RawBody, key = TIKTOK_WEBHOOK_SECRET',
    }),
    (0, swagger_1.ApiBody)({
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
    }),
    __param(0, (0, common_1.Headers)('tiktok-signature')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TikTokController.prototype, "handleLead", null);
exports.TikTokController = TikTokController = __decorate([
    (0, swagger_1.ApiTags)('TikTok'),
    (0, common_1.Controller)('webhooks/tiktok'),
    __metadata("design:paramtypes", [tiktokService_1.TikTokService])
], TikTokController);
//# sourceMappingURL=tiktokController.js.map