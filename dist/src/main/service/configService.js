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
exports.ConfigService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const configEntity_1 = require("../model/entities/configEntity");
let ConfigService = class ConfigService {
    repo;
    cache = {};
    constructor(repo) {
        this.repo = repo;
    }
    async getFieldMapping() {
        const c = this.cache['field_mapping'];
        if (c && Date.now() - c.at < 60_000)
            return c.data;
        const data = (await this.repo.findOneBy({ key: 'field_mapping' }))?.value ?? {};
        this.cache['field_mapping'] = { at: Date.now(), data };
        return data;
    }
    async setFieldMapping(value) { await this.repo.upsert({ key: 'field_mapping', value }, ['key']); }
    async getDealRules() { return (await this.repo.findOneBy({ key: 'deal_rules' }))?.value ?? []; }
    async setDealRules(value) { await this.repo.upsert({ key: 'deal_rules', value }, ['key']); }
};
exports.ConfigService = ConfigService;
exports.ConfigService = ConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(configEntity_1.Configuration)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConfigService);
//# sourceMappingURL=configService.js.map