"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigStoreModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const configEntity_1 = require("../model/entities/configEntity");
const configService_1 = require("../service/configService");
const configController_1 = require("../controller/configController");
let ConfigStoreModule = class ConfigStoreModule {
};
exports.ConfigStoreModule = ConfigStoreModule;
exports.ConfigStoreModule = ConfigStoreModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([configEntity_1.Configuration])],
        controllers: [configController_1.ConfigController],
        providers: [configService_1.ConfigService],
        exports: [configService_1.ConfigService],
    })
], ConfigStoreModule);
//# sourceMappingURL=configStoreModule.js.map