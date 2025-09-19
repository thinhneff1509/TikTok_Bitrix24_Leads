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
exports.LeadsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const leadEntity_1 = require("../model/entities/leadEntity");
const typeorm_2 = require("@nestjs/typeorm");
const dealsService_1 = require("./dealsService");
const bitrixSyncProcessor_1 = require("../jobs/bitrixSyncProcessor");
let LeadsService = class LeadsService {
    repo;
    deals;
    jobs;
    constructor(repo, deals, jobs) {
        this.repo = repo;
        this.deals = deals;
        this.jobs = jobs;
    }
    async list(q) {
        const where = {};
        if (q.source)
            where.source = (0, typeorm_1.ILike)(q.source);
        const [items, total] = await this.repo.findAndCount({
            where, order: { created_at: 'DESC' }, skip: (q.page - 1) * q.limit, take: q.limit,
        });
        return { items, total, page: q.page, limit: q.limit };
    }
    async upsertFromTikTok(data) {
        const found = await this.repo.findOne({
            where: [{ external_id: data.external_id }, { email: data.email ?? '' }, { phone: data.phone ?? '' }],
        });
        if (found) {
            this.repo.merge(found, data, { status: 'updated' });
            return this.repo.save(found);
        }
        return this.repo.save(this.repo.create(data));
    }
    async findById(id) { return this.repo.findOneByOrFail({ id }); }
    async convertToDeal(id, body, probability = 30) {
        const lead = await this.findById(id);
        const title = body.title || `Deal for ${lead.name}`;
        const deal = await this.deals.create({
            title, amount: body.amount, currency: body.currency || 'VND', probability, lead, external_id: `local:${lead.id}`,
        });
        await this.jobs.enqueueDealConversion(lead.id, {
            TITLE: title, OPPORTUNITY: body.amount ?? null, CURRENCY_ID: body.currency || 'VND', PROBABILITY: probability,
        });
        return deal;
    }
};
exports.LeadsService = LeadsService;
exports.LeadsService = LeadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(leadEntity_1.LeadEntity)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        dealsService_1.DealsService,
        bitrixSyncProcessor_1.BitrixSyncProcessor])
], LeadsService);
//# sourceMappingURL=leadsService.js.map