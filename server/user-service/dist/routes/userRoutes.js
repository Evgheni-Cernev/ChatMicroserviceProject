"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const router = (0, express_1.Router)();
router.post('/register', UserController_1.default.register);
router.post('/login', UserController_1.default.login);
router.get('/profile/:userId', UserController_1.default.getProfile);
router.put('/profile/:userId', UserController_1.default.updateProfile);
exports.default = router;
