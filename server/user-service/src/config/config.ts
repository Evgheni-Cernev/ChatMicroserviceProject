import dotenv from 'dotenv';
dotenv.config();

interface Config {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  env: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/userdb',
  jwtSecret: process.env.JWT_SECRET || 'your_secret_here',
  env: process.env.NODE_ENV || 'development'
};

export default config;
