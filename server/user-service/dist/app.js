"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const middlewares_1 = require("./middlewares");
const config_1 = __importDefault(require("./config/config"));
console.warn(process.env.PORT);
const app = (0, express_1.default)();
app.use(middlewares_1.logger); // Логгер для всех запросов
app.use((0, body_parser_1.json)());
app.use((0, body_parser_1.urlencoded)({ extended: true }));
// Регистрация маршрутов пользователя с аутентификацией
app.use("/api/users", middlewares_1.authenticate, userRoutes_1.default);
const PORT = config_1.default.port ||3009;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
exports.default = app;
