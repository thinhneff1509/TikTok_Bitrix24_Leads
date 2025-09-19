"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const leadEntity_1 = require("../model/entities/leadEntity");
const leadsService_1 = require("../service/leadsService");
const leadsController_1 = require("../controller/leadsController");
const dealsModule_1 = require("./dealsModule");
const configStoreModule_1 = require("./configStoreModule");
const jobsModule_1 = require("../jobs/jobsModule");
let LeadsModule = class LeadsModule {
};
exports.LeadsModule = LeadsModule;
exports.LeadsModule = LeadsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([leadEntity_1.LeadEntity]), (0, common_1.forwardRef)(() => dealsModule_1.DealsModule),
            configStoreModule_1.ConfigStoreModule,
            jobsModule_1.JobsModule,],
        controllers: [leadsController_1.LeadsController],
        providers: [leadsService_1.LeadsService],
        exports: [leadsService_1.LeadsService],
    })
], LeadsModule);
//# sourceMappingURL=leadsModule.js.map