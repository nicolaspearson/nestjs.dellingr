import path from 'path';

// Set up test environment variables
process.env.API_HOST = 'localhost';
process.env.API_PORT = '3000';
process.env.ENVIRONMENT = 'test';
process.env.JWT_ALGORITHM = 'HS256';
process.env.JWT_ISSUER = 'support@dellingr.com';
process.env.JWT_SECRET = 'secretKey';
process.env.JWT_TOKEN_EXPIRATION = '15m';
process.env.LOG_LEVEL = 'error';
process.env.NODE_ENV = 'development';
process.env.TYPEORM_CONNECTION = 'postgres';
process.env.TYPEORM_DATABASE = 'dellingr';
process.env.TYPEORM_ENTITIES = path.resolve(__dirname, '../../src/db/entities/*.ts');
process.env.TYPEORM_HOST = process.env.TYPEORM_HOST || 'localhost';
process.env.TYPEORM_MIGRATIONS = path.resolve(__dirname, '../../src/db/migrations/*.ts');
process.env.TYPEORM_MIGRATIONS_RUN = 'true';
process.env.TYPEORM_PASSWORD = 'masterkey';
process.env.TYPEORM_PORT = process.env.TYPEORM_PORT || '5433';
process.env.TYPEORM_SYNCHRONIZE = 'true';
process.env.TYPEORM_USERNAME = 'admin';
process.env.TYPEORM_USE_WEBPACK = 'false';
