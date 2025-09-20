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
        return this.get('field_mapping', {});
    }
    async setFieldMapping(value) {
        await this.set('field_mapping', value);
    }
    async getDealRules() {
        return this.get('deal_rules', []);
    }
    async setDealRules(value) {
        await this.set('deal_rules', value);
    }
    async get(key, fallback) {
        const cell = this.cache[key];
        if (cell && Date.now() - cell.at < 60_000)
            return cell.data;
        const row = await this.repo.findOne({ where: { key } });
        const data = (row?.value ?? fallback);
        this.cache[key] = { at: Date.now(), data };
        return data;
    }
    async set(key, value) {
        await this.repo.upsert({ key, value }, ['key']);
        this.cache[key] = { at: Date.now(), data: value };
    }
};
exports.ConfigService = ConfigService;
exports.ConfigService = ConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(configEntity_1.Configuration)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConfigService);
//# sourceMappingURL=configService.js.map