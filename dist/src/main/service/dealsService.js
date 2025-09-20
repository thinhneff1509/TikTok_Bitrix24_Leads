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
exports.DealsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const dealEntity_1 = require("../model/entities/dealEntity");
let DealsService = class DealsService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async list(q) {
        const where = {};
        const [items, total] = await this.repo.findAndCount({
            where, order: { created_at: 'DESC' }, skip: (q.page - 1) * q.limit, take: q.limit,
        });
        return { items, total, page: q.page, limit: q.limit };
    }
    async create(data) {
        return this.repo.save(this.repo.create(data));
    }
    async upsertByExternalId(externalId, dto) {
        if (!externalId)
            throw new common_1.BadRequestException('external_id is required');
        await this.repo.upsert({ external_id: externalId, ...dto }, { conflictPaths: ['external_id'], skipUpdateIfNoValuesChanged: true });
        return this.repo.findOneByOrFail({ external_id: externalId });
    }
    async upsertFromBitrix(payload) {
        const externalId = String(payload.id ?? payload.ID ?? '');
        if (!externalId) {
            throw new common_1.BadRequestException('external_id is required');
        }
        const amount = payload.amount !== undefined
            ? Number(payload.amount)
            : payload.OPPORTUNITY !== undefined
                ? Number(payload.OPPORTUNITY)
                : undefined;
        const data = {
            title: payload.title ?? payload.TITLE ?? 'Bitrix deal',
            amount,
            currency: payload.currency ?? payload.CURRENCY_ID ?? undefined,
            raw_data: payload,
        };
        return this.upsertByExternalId(externalId, data);
    }
};
exports.DealsService = DealsService;
exports.DealsService = DealsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(dealEntity_1.DealEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DealsService);
//# sourceMappingURL=dealsService.js.map