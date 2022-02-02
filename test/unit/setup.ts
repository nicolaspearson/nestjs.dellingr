// Set up test environment variables
process.env.API_HOST = 'localhost';
process.env.API_PORT = '3000';
process.env.AWS_ACCESS_KEY_ID = '<NOT-SET>';
process.env.AWS_REGION = '<NOT-SET>';
process.env.AWS_SECRET_ACCESS_KEY = '<NOT-SET>';
process.env.AWS_S3_BUCKET_NAME = '<NOT-SET>';
process.env.ENVIRONMENT = 'test';
process.env.JWT_ALGORITHM = 'HS256';
process.env.JWT_ISSUER = 'support@dellingr.com';
process.env.JWT_SECRET = 'secretKey';
process.env.JWT_TOKEN_EXPIRATION = '15m';
process.env.LOG_LEVEL = 'error';
process.env.NODE_ENV = 'development';
