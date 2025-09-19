import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './main/common/pipes/validationPipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Lưu RAW body để verify chữ ký
    app.use(
        bodyParser.json({
            limit: '2mb',
            verify: (req: any, _res, buf: Buffer) => {
                req.rawBody = Buffer.from(buf);
            },
        }),
    );
    app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));

    app.useGlobalPipes(ValidationPipe);
    app.enableCors();

    const cfg = new DocumentBuilder()
        .setTitle('TikTok ↔ Bitrix24 Integration')
        .setDescription('Webhook, Lead/Deal management, Analytics, Export')
        .setVersion('1.0.0')
        .build();
    const doc = SwaggerModule.createDocument(app, cfg);
    SwaggerModule.setup('/docs', app, doc);

    app.getHttpAdapter().get('/health', (_req, res) => {
        res.json({ ok: true, uptime: process.uptime() });
    });

    const port = Number(process.env.PORT ?? 3000);
    await app.listen(port);
    console.log(` http://localhost:${port} | Swagger: /docs`);
}
bootstrap();
