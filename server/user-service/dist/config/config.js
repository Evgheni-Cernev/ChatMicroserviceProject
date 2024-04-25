"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    port: parseInt(process.env.PORT || '3006', 10),
    databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/userdb',
    jwtSecret: process.env.JWT_SECRET || 'your_secret_here',
    env: process.env.NODE_ENV || 'development'
};
exports.default = config;
