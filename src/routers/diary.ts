import express, { Application, Request, Response, NextFunction, Router } from 'express';
const router = Router();
import { userInterface } from  '../types/userInterface';
import Diary from '../models/diary'
import User from '../models/user'
import auth from '../middleware/auth'

router.post('/diary/create', auth, async (req: userInterface , res: Response) => {
    try {
        const diary = new Diary({owner: req.user.username.toLowerCase(), ...req.body})
        await diary.save()
        res.send(diary)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('diary/delete/:id', auth, async (req: userInterface , res: Response) => { 
    if(req.user.username.toLowerCase() !== req.body.owner.toLowerCase() ) {
        return res.status(400).send({error: 'You are not the owner of this diary'})
    }
    try {
        const diary = await Diary.findOneAndDelete({_id: req.params.id})
        res.send('diary deleted')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/diary/id/:id', async (req: Request , res: Response) => {
    try {
        const diary = await Diary.findById(req.params.id)
        if (!diary) {
            return res.status(404).send()
        }
        res.send(diary)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/diary/user/:username', async (req: Request , res: Response) => {

    try {
        console.log(req.params.username)
        const diary = await Diary.find({owner: req.params.username.toLowerCase()})
        if (!diary) {
            return res.status(404).send()
        }
        res.send(diary)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/diary/all', async (req: Request , res: Response) => {
    try {
        const diaries = await Diary.find({})
        res.send(diaries)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/diary/mine', auth, async (req: userInterface , res: Response) => {    
    try {
        const diaries = await Diary.find({owner: req.user.username.toLowerCase()})
        res.send(diaries)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.put('/diary/update/:id', auth, async (req: userInterface , res: Response) => {
    if(req.user.username.toLowerCase() !== req.body.owner.toLowerCase()) {
        return res.status(401).send({ error: 'You are not authorized to update this diary' 
    })}
        
    const updates = Object.keys(req.body)
    const allowedUpdates = ['diaryName', 'type', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const diary = await Diary.findById(req.params.id)

        if (!diary) {
            return res.status(404).send()
        }

        updates.forEach((update) => diary[update] = req.body[update])
        await diary.save()
        res.send(diary)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.put('/diary/picture/:id', auth, async (req: userInterface , res: Response) => {
    if(req.user.username.toLowerCase() !== req.body.owner.toLowerCase()) {
        return res.status(401).send({ error: 'You are not authorized to update this diary' 
    })}

    try {
        const diary = await Diary.findById(req.params.id)

        if (!diary) {
            return res.status(404).send()
        }

        diary.picture = req.body.picture
        await diary.save()
        res.send(diary)
    }
    catch (e) {
        res.status(400).send(e)
    }

})

router.put('/diary/comment/:id', auth, async (req: userInterface , res: Response) => { 
    try {
        const diary = await Diary.findById(req.params.id)
        if (!diary) {
            return res.status(404).send()
        }
        diary.comments.push({comment: req.body.comment, owner: req.user.username})
        await diary.save()
        res.send(diary)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

export { router as diaryRouter };
