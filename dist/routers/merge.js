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
exports.mergeRouter = void 0;
const express_1 = require("express");
const user_1 = __importDefault(require("../models/user"));
const diary_1 = __importDefault(require("../models/diary"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
exports.mergeRouter = router;
router.get('usersanddiaries/:username ', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ username: req.params.username });
        const diary = yield diary_1.default.find({ user: user._id });
        res.send({ user, diary });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get('/meandmine', auth_1.default, (req, res) => {
    user_1.default.findOne({ username: req.user.username })
        .then((user) => {
        diary_1.default.find({ owner: req.user.username })
            .then((diary) => {
            res.send({ user, diary });
        });
    });
});
