"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("../models");
const tokenUtils_1 = require("../utils/tokenUtils");
class UserService {
    /**
     * Создание нового пользователя с хешированием пароля
     */
    createUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = yield models_1.User.create({
                username,
                password: hashedPassword
            });
            return user;
        });
    }
    /**
     * Проверка учетных данных пользователя и генерация JWT
     */
    authenticateUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.User.findOne({ where: { username } });
            if (!user) {
                throw new Error('User not found');
            }
            const passwordIsValid = yield bcrypt_1.default.compare(password, user.password);
            if (!passwordIsValid) {
                throw new Error('Invalid credentials');
            }
            const token = (0, tokenUtils_1.generateToken)(user.id);
            return token;
        });
    }
    /**
     * Получение информации о пользователе по ID
     */
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        });
    }
    /**
     * Обновление профиля пользователя
     */
    updateUser(userId, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }
            user.username = username || user.username;
            if (password) {
                user.password = yield bcrypt_1.default.hash(password, 10);
            }
            yield user.save();
            return user;
        });
    }
}
exports.UserService = UserService;
