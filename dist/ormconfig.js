"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const typeorm_1 = require("typeorm");
const isProd = process.env.NODE_ENV === 'production';
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'tiktok_b24',
    entities: isProd
        ? ['dist/main/model/entities/*{.js,.mjs}']
        : ['src/main/model/entities/*{.ts,.tsx}'],
    migrations: isProd
        ? ['dist/main/module/database/migration/*{.js,.mjs}']
        : ['src/main/module/database/migration/*{.ts,.tsx}'],
    migrationsTableName: 'typeorm_migrations',
    synchronize: false,
    logging: process.env.TYPEORM_LOGGING === 'true',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});
//# sourceMappingURL=ormconfig.js.map