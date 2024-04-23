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
Object.defineProperty(exports, "__esModule", { value: true });
const UserService_1 = require("../services/UserService");
const userService = new UserService_1.UserService();
class UserController {
    /**
     * Регистрация нового пользователя
     */
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                const user = yield userService.createUser(username, password);
                res.status(201).json(user);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    /**
     * Аутентификация пользователя и выдача JWT
     */
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                const token = yield userService.authenticateUser(username, password);
                res.json({ token });
            }
            catch (error) {
                res.status(401).json({ message: error.message });
            }
        });
    }
    /**
     * Получение данных текущего пользователя
     */
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.params.userId);
                const user = yield userService.getUserById(userId);
                res.json(user);
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
    /**
     * Обновление профиля пользователя
     */
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = parseInt(req.params.userId);
                const { username, password } = req.body;
                const updatedUser = yield userService.updateUser(userId, username, password);
                res.json(updatedUser);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.default = new UserController();
