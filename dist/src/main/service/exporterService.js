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
exports.ExporterService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const leadEntity_1 = require("../model/entities/leadEntity");
let ExporterService = class ExporterService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async exportCSV(days = 30) {
        const to = new Date();
        const from = new Date(to.getTime() - days * 86400000);
        const rows = await this.repo.createQueryBuilder('l')
            .where('l.created_at BETWEEN :from AND :to', { from, to })
            .orderBy('l.created_at', 'DESC')
            .getMany();
        const header = ['id', 'external_id', 'source', 'name', 'email', 'phone', 'campaign_id', 'ad_id', 'status', 'created_at'];
        const lines = [header.join(',')];
        for (const r of rows) {
            lines.push([
                r.id, r.external_id, r.source, JSON.stringify(r.name),
                r.email ?? '', r.phone ?? '', r.campaign_id ?? '', r.ad_id ?? '',
                r.status, r.created_at.toISOString(),
            ].join(','));
        }
        return lines.join('\n');
    }
};
exports.ExporterService = ExporterService;
exports.ExporterService = ExporterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(leadEntity_1.LeadEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExporterService);
//# sourceMappingURL=exporterService.js.map