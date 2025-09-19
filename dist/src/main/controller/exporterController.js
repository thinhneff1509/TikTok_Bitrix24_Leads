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
exports.ExporterController = void 0;
const common_1 = require("@nestjs/common");
const exporterService_1 = require("../service/exporterService");
let ExporterController = class ExporterController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    async export(dr) {
        const days = dr?.endsWith('d') ? Number(dr.slice(0, -1)) : 30;
        return this.svc.exportCSV(days);
    }
};
exports.ExporterController = ExporterController;
__decorate([
    (0, common_1.Get)('export'),
    (0, common_1.Header)('Content-Type', 'text/csv'),
    (0, common_1.Header)('Content-Disposition', 'attachment; filename="leads.csv"'),
    __param(0, (0, common_1.Query)('date_range')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExporterController.prototype, "export", null);
exports.ExporterController = ExporterController = __decorate([
    (0, common_1.Controller)('api/v1/reports'),
    __metadata("design:paramtypes", [exporterService_1.ExporterService])
], ExporterController);
//# sourceMappingURL=exporterController.js.map