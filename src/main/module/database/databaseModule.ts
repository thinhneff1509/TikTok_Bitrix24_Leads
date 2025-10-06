import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const isProd = process.env.NODE_ENV === 'production';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'tiktok_b24',

  entities: isProd
    ? ['dist/main/model/entities/**/*.js']
    : ['src/main/model/entities/**/*.ts'],

  migrations: isProd
    ? ['dist/main/module/database/migration/*.js']
    : ['src/main/module/database/migration/*.ts'],

  migrationsTableName: 'typeorm_migrations',
  synchronize: false, // always false
  logging: process.env.TYPEORM_LOGGING === 'true',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
