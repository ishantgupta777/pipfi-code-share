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
require("reflect-metadata");
require("dotenv-safe").config();
const express_1 = __importDefault(require("express"));
const User_1 = require("./entities/User");
const passport_github_1 = require("passport-github");
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const PipfiUrl_1 = require("./entities/PipfiUrl");
const isAuth_1 = require("./isAuth");
const db_1 = __importDefault(require("./db"));
const app = express_1.default();
app.use(cors_1.default({ origin: "*" }));
app.use(passport_1.default.initialize());
app.use(express_1.default.json());
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default();
    passport_1.default.serializeUser((user, done) => {
        done(null, user.accessToken);
    });
    passport_1.default.use(new passport_github_1.Strategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "https://pipfi.herokuapp.com/auth/github/callback",
    }, (_, __, profile, cb) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(profile._json, profile.displayName, profile.emails, profile.id, profile.profileUrl, profile.username, profile.photos);
        let user = yield User_1.UserData.findOne({ where: { githubId: profile.id } });
        if (user) {
            user.name = profile.displayName;
            user.githubUserName = profile.username || "";
            user.avatarUrl = profile.photos ? profile.photos[0].value : "";
            user.email = (profile === null || profile === void 0 ? void 0 : profile.emails) ? profile.emails[0].value : "";
            user.githubId = profile.id;
            yield user.save();
        }
        else {
            user = yield User_1.UserData.create({
                name: profile.displayName,
                githubId: profile.id,
                githubUserName: profile.username,
                avatarUrl: profile.photos ? profile.photos[0].value : "",
                email: (profile === null || profile === void 0 ? void 0 : profile.emails) ? profile.emails[0].value : ""
            }).save();
        }
        cb(null, {
            accessToken: jsonwebtoken_1.default.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "1y",
            }),
        });
    })));
    app.get("/auth/github", passport_1.default.authenticate("github", { session: false }));
    app.get("/auth/github/callback", passport_1.default.authenticate("github", { session: false }), (req, res) => {
        res.redirect(`http://localhost:54331/auth/${req.user.accessToken}`);
    });
    app.get("/links", isAuth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const links = yield PipfiUrl_1.PipfiUrl.find({
                where: { ownerId: req.userId },
                order: { id: "DESC" },
            });
            res.send({ links });
        }
        catch (err) {
            console.log(err);
            res.status(500).send({ message: 'Error in server while getting links' });
        }
    }));
    app.post("/addLink", isAuth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const link = yield PipfiUrl_1.PipfiUrl.create({
                title: req.body.title,
                description: req.body.description,
                url: req.body.url,
                ownerId: req.userId
            }).save();
            res.send({ link });
        }
        catch (err) {
            console.log(err);
            res.status(500).send({ message: 'Error in server while adding new link' });
        }
    }));
    app.put("/updateLink", isAuth_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const link = yield PipfiUrl_1.PipfiUrl.findOne(req.body.id);
        if (!link) {
            res.send({ link: null });
            return;
        }
        if (link.ownerId !== req.userId) {
            res.status(401).send({ message: 'Not authorized' });
        }
        link.description = req.body.description;
        link.title = req.body.title;
        link.ownerId = req.body.ownerId;
        link.url = req.body.url;
        yield link.save();
        res.send({ link });
    }));
    app.get("/me", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                res.send({ user: null });
                return;
            }
            const token = authHeader.split(" ")[1];
            if (!token) {
                res.send({ user: null });
                return;
            }
            let userId = "";
            try {
                const payload = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
                userId = payload.userId;
            }
            catch (err) {
                res.send({ user: null });
                return;
            }
            if (!userId) {
                res.send({ user: null });
                return;
            }
            const user = yield User_1.UserData.findOne(userId);
            res.send({ user });
        }
        catch (err) {
            res.status(500).send('Error in server while getting user data');
        }
    }));
    app.get("/", (_req, res) => {
        res.send("Hello, This is pipfi backend.");
    });
    app.listen(process.env.PORT || 3000, () => {
        console.log("listening on localhost:3000");
    });
});
main();
//# sourceMappingURL=index.js.map