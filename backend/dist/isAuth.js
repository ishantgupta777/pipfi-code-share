"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuth = (req, _, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Error("not authenticated");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new Error("not authenticated");
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userId = payload.userId;
        next();
        return;
    }
    catch (_a) { }
    throw new Error("not authenticated");
};
exports.isAuth = isAuth;
//# sourceMappingURL=isAuth.js.map