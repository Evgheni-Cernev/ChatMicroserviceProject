"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const User_1 = __importDefault(require("./User"));
const sequelize = new sequelize_1.Sequelize((_a = process.env.DATABASE_URL) !== null && _a !== void 0 ? _a : "postgres://postgres:password@localhost:5432/userdb", {
    dialect: "postgres",
    logging: false,
});
const User = (0, User_1.default)(sequelize);
exports.User = User;
exports.default = sequelize;
