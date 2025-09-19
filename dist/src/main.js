"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const validationPipe_1 = require("./main/common/pipes/validationPipe");
const swagger_1 = require("@nestjs/swagger");
const bodyParser = __importStar(require("body-parser"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(bodyParser.json({
        limit: '2mb',
        verify: (req, _res, buf) => {
            req.rawBody = Buffer.from(buf);
        },
    }));
    app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));
    app.useGlobalPipes(validationPipe_1.ValidationPipe);
    app.enableCors();
    const cfg = new swagger_1.DocumentBuilder()
        .setTitle('TikTok ↔ Bitrix24 Integration')
        .setDescription('Webhook, Lead/Deal management, Analytics, Export')
        .setVersion('1.0.0')
        .build();
    const doc = swagger_1.SwaggerModule.createDocument(app, cfg);
    swagger_1.SwaggerModule.setup('/docs', app, doc);
    app.getHttpAdapter().get('/health', (_req, res) => {
        res.json({ ok: true, uptime: process.uptime() });
    });
    const port = Number(process.env.PORT ?? 3000);
    await app.listen(port);
    console.log(` http://localhost:${port} | Swagger: /docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map