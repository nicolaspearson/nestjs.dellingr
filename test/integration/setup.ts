// Set up test environment variables
process.env.API_HOST = 'localhost';
process.env.API_PORT = '3000';
process.env.DATABASE_LOG_LEVEL = 'error';
process.env.DATABASE_URL = 'postgresql://admin:masterkey@localhost:5432/dellingr?schema=public';
process.env.ENVIRONMENT = 'test';
process.env.LOG_LEVEL = 'error';
process.env.NODE_ENV = 'production';
