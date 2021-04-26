"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send({ message: 'Not authenticated' });
    }
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
    if (!token) {
        res.status(401).send({ message: 'Not authenticated' });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token || "", process.env.ACCESS_TOKEN_SECRET);
        req.userId = payload.userId;
        next();
        return;
    }
    catch (_a) { }
    res.status(401).send({ message: 'Not authenticated' });
};
exports.isAuth = isAuth;
//# sourceMappingURL=isAuth.js.map