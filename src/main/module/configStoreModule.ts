import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from '../model/entities/configEntity';
import { ConfigService } from '../service/configService';
import { ConfigController } from '../controller/configController';

@Module({
    imports: [TypeOrmModule.forFeature([Configuration])],
    controllers: [ConfigController],
    providers: [ConfigService],
    exports: [ConfigService],
})
export class ConfigStoreModule {}
