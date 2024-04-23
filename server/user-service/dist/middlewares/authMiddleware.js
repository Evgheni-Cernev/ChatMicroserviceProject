"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const tokenUtils_1 = require("../utils/tokenUtils");
const authenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }
    try {
        const decoded = (0, tokenUtils_1.verifyToken)(token);
        req.body.userId = decoded.userId;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Failed to authenticate token.' });
    }
};
exports.authenticate = authenticate;
