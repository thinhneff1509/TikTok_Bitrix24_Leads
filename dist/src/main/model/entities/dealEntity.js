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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealEntity = void 0;
const typeorm_1 = require("typeorm");
const leadEntity_1 = require("./leadEntity");
class ColumnNumericTransformer {
    to(value) { return value; }
    from(value) {
        return typeof value === 'string' ? Number(value) : value;
    }
}
let DealEntity = class DealEntity {
    id;
    lead;
    bitrix24_id;
    title;
    amount;
    currency;
    stage;
    probability;
    external_id;
    raw_data;
    created_at;
    updated_at;
};
exports.DealEntity = DealEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DealEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => leadEntity_1.LeadEntity, { eager: true, nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'lead_id' }),
    __metadata("design:type", Object)
], DealEntity.prototype, "lead", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DealEntity.prototype, "bitrix24_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], DealEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'numeric',
        precision: 14,
        scale: 2,
        nullable: true,
        transformer: new ColumnNumericTransformer(),
    }),
    __metadata("design:type", Object)
], DealEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 8, default: 'VND' }),
    __metadata("design:type", String)
], DealEntity.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 64, nullable: true }),
    __metadata("design:type", String)
], DealEntity.prototype, "stage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], DealEntity.prototype, "probability", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 128 }),
    __metadata("design:type", String)
], DealEntity.prototype, "external_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], DealEntity.prototype, "raw_data", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DealEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DealEntity.prototype, "updated_at", void 0);
exports.DealEntity = DealEntity = __decorate([
    (0, typeorm_1.Entity)('deals')
], DealEntity);
//# sourceMappingURL=dealEntity.js.map