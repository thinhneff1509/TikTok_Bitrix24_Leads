import 'dotenv/config';
import { DataSource } from 'typeorm';

const isProd = process.env.NODE_ENV === 'production';

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',        // chạy API trong Docker network: dùng 'postgres'
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'tiktok_b24',

    // Khớp build: .ts khi dev, .js khi build dist
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

