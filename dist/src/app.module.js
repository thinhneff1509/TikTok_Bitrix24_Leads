"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const httpExceptionFilter_1 = require("./main/common/filters/httpExceptionFilter");
const loggingInterceptor_1 = require("./main/common/interceptors/loggingInterceptor");
const configStoreModule_1 = require("./main/module/configStoreModule");
const analyticsModule_1 = require("./main/module/analyticsModule");
const exporterModule_1 = require("./main/module/exporterModule");
const integrations_1 = require("./main/integrations");
const jobsModule_1 = require("./main/jobs/jobsModule");
const tiktokController_1 = require("./main/controller/tiktokController");
const bitrixWebhookController_1 = require("./main/controller/bitrixWebhookController");
const healthController_1 = require("./main/controller/healthController");
const tiktokService_1 = require("./main/service/tiktokService");
const throttler_1 = require("@nestjs/throttler");
const leadsModule_1 = require("./main/module/leadsModule");
const dealsModule_1 = require("./main/module/dealsModule");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([
                { ttl: 60, limit: 120 },
            ]),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: 'postgres',
                    host: process.env.DB_HOST || 'localhost',
                    port: parseInt(process.env.DB_PORT || '5432', 10),
                    username: process.env.DB_USER || 'postgres',
                    password: process.env.DB_PASS || 'postgres',
                    database: process.env.DB_NAME || 'tiktok_b24',
                    autoLoadEntities: true,
                    synchronize: false,
                }),
            }),
            leadsModule_1.LeadsModule,
            dealsModule_1.DealsModule,
            configStoreModule_1.ConfigStoreModule,
            analyticsModule_1.AnalyticsModule,
            exporterModule_1.ExporterModule,
            integrations_1.BitrixModule,
            jobsModule_1.JobsModule,
        ],
        controllers: [tiktokController_1.TikTokController, bitrixWebhookController_1.BitrixWebhookController, healthController_1.HealthController],
        providers: [
            tiktokService_1.TikTokService,
            { provide: core_1.APP_FILTER, useClass: httpExceptionFilter_1.HttpExceptionFilter },
            { provide: core_1.APP_INTERCEPTOR, useClass: loggingInterceptor_1.LoggingInterceptor },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map