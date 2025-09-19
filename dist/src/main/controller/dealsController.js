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
exports.DealsController = void 0;
const dealsService_1 = require("../service/dealsService");
const dealDto_1 = require("../model/dto/dealDto");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let DealsController = class DealsController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    async list(q) {
        return this.svc.list(q);
    }
};
exports.DealsController = DealsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List deals' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String, example: 'open' }),
    (0, swagger_1.ApiQuery)({ name: 'assigned_to', required: false, type: String, example: '123' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dealDto_1.ListDealsDto]),
    __metadata("design:returntype", Promise)
], DealsController.prototype, "list", null);
exports.DealsController = DealsController = __decorate([
    (0, common_1.Controller)('api/v1/deals'),
    __metadata("design:paramtypes", [dealsService_1.DealsService])
], DealsController);
//# sourceMappingURL=dealsController.js.map