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
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.header('Authorization')) {
            let token = req.header('Authorization');
            if (token) {
                token = token.replace('Bearer', '');
                const decoded = jwt.verify(token, process.env.JWT_TOKEN);
                const user = yield User.findById(decoded._id);
                if (!user) {
                    throw new Error();
                }
                req.token = token;
                req.user = user;
                next();
            }
        }
        return res.status(401).send({ error: 'ჰედერი არის ანდეფაინდი' });
    }
    catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
});
module.exports = auth;
