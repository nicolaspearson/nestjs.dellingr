-- The database is created by the docker-compose.yml
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the schemas
CREATE SCHEMA IF NOT EXISTS public;
