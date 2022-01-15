var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
const User = require('../models/user');
const Diary = require('../models/diary');
const router = new express.Router();
const auth = require('../middleware/auth');
router.get('usersanddiaries/:username ', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findOne({ username: req.params.username });
        const diary = yield Diary.find({ user: user._id });
        res.send({ user, diary });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get('/meandmine', auth, (req, res) => {
    User.findOne({ username: req.user.username })
        .then(user => {
        Diary.find({ owner: req.user.username })
            .then(diary => {
            res.send({ user, diary });
        });
    });
});
export { router as mergeRouter };
