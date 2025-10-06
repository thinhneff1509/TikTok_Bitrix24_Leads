import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// run test
@ApiTags('Health')
@Controller()
export class HealthController {
  @Get('/health')
  @ApiOperation({ summary: 'Health check' })
  health() {
    return { ok: true };
  }
}
