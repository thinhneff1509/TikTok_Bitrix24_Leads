import { Body, Controller, Get, Put } from '@nestjs/common';
import { ConfigService } from '../service/configService';

@Controller('api/v1/config')
export class ConfigController {
    constructor(private readonly svc: ConfigService) {}

    @Get('mappings') async getMappings() {
        return this.svc.getFieldMapping()
    }
    @Put('mappings') async putMappings(@Body() body: any) {
        await this.svc.setFieldMapping(body);
        return { ok: true };
    }

    @Get('rules') async getRules() {
        return this.svc.getDealRules();
    }
    @Put('rules') async putRules(@Body() body: any[]) {
        await this.svc.setDealRules(body);
        return { ok: true };
    }
}
