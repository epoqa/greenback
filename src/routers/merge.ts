import express, { Application, Request, Response, NextFunction, Router } from 'express';
import User from '../models/user';
import Diary from '../models/diary';
import auth from '../middleware/auth';

const router = Router();
import { userInterface } from '../types/userInterface';
import { ToObjectOptions } from 'mongoose';


router.get('usersanddiaries/:username ', async (req: Request, res: Response) => {
    try {   
        const user = await User.findOne({username: req.params.username})
        const diary = await Diary.find({user: user._id})
        res.send({user, diary})
    }
    catch (e) {
        res.status(500).send(e)
    }
})

router.get('/meandmine', auth, (req: userInterface, res: Response) => {
    User.findOne({username: req.user.username})
    .then((user: object) => {
        Diary.find({owner: req.user.username})
        .then((diary: object) => {
            res.send({user, diary})
        })
    })
})





export { router as mergeRouter };
