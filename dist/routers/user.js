var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
import User from '../models/user';
const router = Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth';
import dotenv from 'dotenv';
dotenv.config();
import { generateAuthToken, removeItemOnce } from '../services/services';
const refreshTokens = [];
router.post('/users/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.username = req.body.username.toLowerCase();
    const user = new User(req.body);
    try {
        const existWithEmail = yield User.findOne({ email: req.body.email });
        if (existWithEmail) {
            return res.status(400).send({ error: 'ასეთი ემაილი უკვე არსებობს' });
        }
        const existWithUsername = yield User.findOne({
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
        removeItemOnce(refreshTokens, refreshToken);
        res.send({ message: 'წარმატებით გამოვიდა' });
    }
    catch (e) {
        res.status(400).send();
    }
}));
router.post('/users/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send({ error: 'ემაილი არასწორია' });
        }
        const isMatch = yield bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'პაროლი არასწორია' });
        }
        const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH_TOKEN, { expiresIn: '365d' });
        refreshTokens.push(refreshToken);
        const token = yield generateAuthToken(user._id);
        res.send({ user, token, refreshToken });
    }
    catch (e) {
        res.status(400).send();
    }
}));
router.put('/users/update', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.username = req.body.username.toLowerCase();
    const existWithEmail = yield User.findOne({ email: req.body.email });
    if (existWithEmail) {
        return res.status(400).send({ error: 'ასეთი ემაილი უკვე არსებობს' });
    }
    const existWithUsername = yield User.findOne({
        username: req.body.username.toLowerCase(),
    });
    if (existWithUsername) {
        return res.status(400).send({ error: 'მომხმარებელი უკვე არსებობს' });
    }
    if (req.body.password) {
        req.body.password = yield bcrypt.hash(req.body.password, 8);
    }
    try {
        const user = yield User.findByIdAndUpdate(req.user._id, req.body, {
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
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).send({ error: 'Refresh Token Is Expired' });
        }
        const HasRefreshToken = refreshTokens.includes(refreshToken);
        if (!HasRefreshToken) {
            return res.status(401).send({ error: 'Refresh Token Is Invalid' });
        }
        decoded = jwt.decode(refreshToken);
        token = yield generateAuthToken(decoded._id);
        res.send({ refreshToken, token });
    }));
});
router.get('/users/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = yield User.find({});
        res.send(userInfo);
    }
    catch (e) {
        res.status(500).send();
    }
}));
router.get('/users/me', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(req.user);
}));
router.get('/users/:username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params.username.toLowerCase();
    try {
        const user = yield User.findOne({ username });
        if (!user) {
            return res.status(404).send("user doesn't exist");
        }
        res.send(user);
    }
    catch (e) {
        res.status(500).send();
    }
}));
export { router as userRouter };
