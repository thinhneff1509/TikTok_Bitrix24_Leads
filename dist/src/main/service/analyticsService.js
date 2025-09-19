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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leadEntity_1 = require("../model/entities/leadEntity");
const dealEntity_1 = require("../model/entities/dealEntity");
let AnalyticsService = class AnalyticsService {
    leads;
    deals;
    constructor(leads, deals) {
        this.leads = leads;
        this.deals = deals;
    }
    async conversionRates(days = 30) {
        const to = new Date();
        const from = new Date(to.getTime() - days * 86400000);
        const totalLeads = await this.leads.count({ where: { created_at: (0, typeorm_2.Between)(from, to) } });
        const totalDeals = await this.deals.count({ where: { created_at: (0, typeorm_2.Between)(from, to) } });
        return { from, to, totalLeads, totalDeals, rate: totalLeads ? +(totalDeals / totalLeads * 100).toFixed(2) : 0 };
    }
    async campaignPerformance() {
        const qb = this.leads.createQueryBuilder('l')
            .select('l.campaign_id', 'campaign_id')
            .addSelect('COUNT(*)::int', 'leads')
            .groupBy('l.campaign_id')
            .orderBy('leads', 'DESC');
        const rows = await qb.getRawMany();
        return rows;
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leadEntity_1.LeadEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(dealEntity_1.DealEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analyticsService.js.map