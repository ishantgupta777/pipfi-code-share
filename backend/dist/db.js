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
const typeorm_1 = require("typeorm");
const path_1 = require("path");
require("dotenv-safe").config();
const isProductionEnvironment = process.env.NODE_ENV === "production";
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    typeorm_1.createConnection({
        type: "postgres",
        database: process.env.DATABASE || "pipfi",
        entities: [path_1.join(__dirname, "./entities/*.*")],
        username: process.env.USERNAME || 'postgres',
        password: process.env.PASSWORD || 'postgres',
        port: 5432,
        host: process.env.HOST || 'postgres',
        logging: !isProductionEnvironment,
        synchronize: !isProductionEnvironment,
    });
});
//# sourceMappingURL=db.js.map