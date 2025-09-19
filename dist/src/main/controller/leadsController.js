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
exports.LeadsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const leadsService_1 = require("../service/leadsService");
const leadDto_1 = require("../model/dto/leadDto");
let LeadsController = class LeadsController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    async list(q) {
        return this.svc.list(q);
    }
    async convert(p, body) {
        return this.svc.convertToDeal(p.id, body, 30);
    }
};
exports.LeadsController = LeadsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List leads' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'source', required: false, type: String, example: 'tiktok' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leadDto_1.ListLeadsDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(':id/convert-to-deal'),
    (0, swagger_1.ApiOperation)({ summary: 'Convert a lead to a deal' }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Lead ID (UUID v4)',
        schema: { type: 'string', format: 'uuid' },
        example: 'ba9d25a5-41a1-42bd-9570-47cf31856dd2',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string', example: 'Deal from TikTok' },
                amount: { type: 'number', example: 1000000 },
                currency: { type: 'string', example: 'VND' },
            },
            required: ['title'],
        },
    }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leadDto_1.LeadIdParam, leadDto_1.ConvertLeadDto]),
    __metadata("design:returntype", Promise)
], LeadsController.prototype, "convert", null);
exports.LeadsController = LeadsController = __decorate([
    (0, swagger_1.ApiTags)('Leads'),
    (0, common_1.Controller)('api/v1/leads'),
    __metadata("design:paramtypes", [leadsService_1.LeadsService])
], LeadsController);
//# sourceMappingURL=leadsController.js.map