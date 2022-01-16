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
exports.userRouter = void 0;
const express_1 = require("express");
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../middleware/auth"));
require('dotenv').config();
const router = (0, express_1.Router)();
exports.userRouter = router;
const services_1 = require("../services/services");
const refreshTokens = [];
router.post('/users/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.username = req.body.username.toLowerCase();
    const user = new user_1.default(req.body);
    try {
        const existWithEmail = yield user_1.default.findOne({ email: req.body.email });
        if (existWithEmail) {
            return res.status(400).send({ error: 'ასეთი ემაილი უკვე არსებობს' });
        }
        const existWithUsername = yield user_1.default.findOne({
            username: req.body.username.toLowerCase(),
        });
        if (existWithUsername) {
            return res
                .status(400)
                .send({ error: 'ასეთი მომხმარებელი უკვე არსებობს' });
        }
        yield user.save();
        res.status(201).send({ user });
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.delete('/users/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        (0, services_1.removeItemOnce)(refreshTokens, refreshToken);
        res.send({ message: 'წარმატებით გამოვიდა' });
    }
    catch (e) {
        res.status(400).send();
    }
}));
router.post('/users/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send({ error: 'ემაილი არასწორია' });
        }
        const isMatch = yield bcryptjs_1.default.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'პაროლი არასწორია' });
        }
        let JWTREFRESHTOKEN;
        if (process.env.JWT_REFRESH_TOKEN) {
            JWTREFRESHTOKEN = process.env.JWT_REFRESH_TOKEN;
        }
        else {
            throw new Error("JWT REFRESH TOKEN IS NOT SET");
        }
        const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, JWTREFRESHTOKEN, { expiresIn: '365d' });
        refreshTokens.push(refreshToken);
        const token = yield (0, services_1.generateAuthToken)(user._id);
        res.send({ user, token, refreshToken });
    }
    catch (e) {
        res.status(400).send();
    }
}));
router.put('/users/update', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.username = req.body.username.toLowerCase();
    const existWithEmail = yield user_1.default.findOne({ email: req.body.email });
    if (existWithEmail) {
        return res.status(400).send({ error: 'ასეთი ემაილი უკვე არსებობს' });
    }
    const existWithUsername = yield user_1.default.findOne({
        username: req.body.username.toLowerCase(),
    });
    if (existWithUsername) {
        return res.status(400).send({ error: 'მომხმარებელი უკვე არსებობს' });
    }
    if (req.body.password) {
        req.body.password = yield bcryptjs_1.default.hash(req.body.password, 8);
    }
    try {
        const user = yield user_1.default.findByIdAndUpdate(req.user._id, req.body, {
            new: true,
            runValidators: true,
        });
        res.send(user);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.post('/renewAccessToken', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).send({ error: 'No refresh token' });
    }
    let JWTREFRESHTOKEN;
    if (process.env.JWT_REFRESH_TOKEN) {
        JWTREFRESHTOKEN = process.env.JWT_REFRESH_TOKEN;
    }
    else {
        throw new Error("JWT REFRESH TOKEN IS NOT SET");
    }
    jsonwebtoken_1.default.verify(refreshToken, JWTREFRESHTOKEN, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).send({ error: 'Refresh Token Is Expired' });
        }
        const HasRefreshToken = refreshTokens.includes(refreshToken);
        if (!HasRefreshToken) {
            return res.status(401).send({ error: 'Refresh Token Is Invalid' });
        }
        const decoded = jsonwebtoken_1.default.decode(refreshToken);
        if (!decoded) {
            const userId = decoded._id;
            const token = yield (0, services_1.generateAuthToken)(userId);
            res.send({ refreshToken, token });
        }
        else {
            return res.status(401).send({ error: 'Refresh Token Is Invalid' });
        }
    }));
});
router.get('/users/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = yield user_1.default.find({});
        res.send(userInfo);
    }
    catch (e) {
        res.status(500).send();
    }
}));
router.get('/users/me', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(req.user);
}));
router.get('/users/:username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params.username.toLowerCase();
    try {
        const user = yield user_1.default.findOne({ username });
        if (!user) {
            return res.status(404).send("user doesn't exist");
        }
        res.send(user);
    }
    catch (e) {
        res.status(500).send();
    }
}));
