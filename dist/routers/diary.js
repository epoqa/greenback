var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const router = new express.Router();
const Diary = require('../models/diary');
const User = require('../models/user');
const auth = require('../middleware/auth');
router.post('/diary/create', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const diary = new Diary(Object.assign({ owner: req.user.username.toLowerCase() }, req.body));
        yield diary.save();
        res.send(diary);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.delete('diary/delete/:id', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.username.toLowerCase() !== req.body.owner.toLowerCase()) {
        return res.status(400).send({ error: 'You are not the owner of this diary' });
    }
    try {
        const diary = yield Diary.findOneAndDelete({ _id: req.params.id });
        res.send('diary deleted');
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.get('/diary/id/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const diary = yield Diary.findById(req.params.id);
        if (!diary) {
            return res.status(404).send();
        }
        res.send(diary);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get('/diary/user/:username', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.params.username);
        const diary = yield Diary.find({ owner: req.params.username.toLowerCase() });
        if (!diary) {
            return res.status(404).send();
        }
        res.send(diary);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get('/diary/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const diaries = yield Diary.find({});
        res.send(diaries);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get('/diary/mine', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const diaries = yield Diary.find({ owner: req.user.username.toLowerCase() });
        res.send(diaries);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.put('/diary/update/:id', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.username.toLowerCase() !== req.body.owner.toLowerCase()) {
        return res.status(401).send({ error: 'You are not authorized to update this diary'
        });
    }
    const updates = Object.keys(req.body);
    const allowedUpdates = ['diaryName', 'type', 'description'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    try {
        const diary = yield Diary.findById(req.params.id);
        if (!diary) {
            return res.status(404).send();
        }
        updates.forEach((update) => diary[update] = req.body[update]);
        yield diary.save();
        res.send(diary);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.put('/diary/picture/:id', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user.username.toLowerCase() !== req.body.owner.toLowerCase()) {
        return res.status(401).send({ error: 'You are not authorized to update this diary'
        });
    }
    try {
        const diary = yield Diary.findById(req.params.id);
        if (!diary) {
            return res.status(404).send();
        }
        diary.picture = req.body.picture;
        yield diary.save();
        res.send(diary);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.put('/diary/comment/:id', auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const diary = yield Diary.findById(req.params.id);
        if (!diary) {
            return res.status(404).send();
        }
        diary.comments.push({ comment: req.body.comment, owner: req.user.username });
        yield diary.save();
        res.send(diary);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
export { router as diaryRouter };
