"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExporterModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const leadEntity_1 = require("../model/entities/leadEntity");
const exporterController_1 = require("../controller/exporterController");
const exporterService_1 = require("../service/exporterService");
let ExporterModule = class ExporterModule {
};
exports.ExporterModule = ExporterModule;
exports.ExporterModule = ExporterModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([leadEntity_1.LeadEntity])],
        controllers: [exporterController_1.ExporterController],
        providers: [exporterService_1.ExporterService],
    })
], ExporterModule);
//# sourceMappingURL=exporterModule.js.map