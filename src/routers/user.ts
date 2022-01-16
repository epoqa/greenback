import express, { Application, Request, Response, NextFunction, Router } from 'express';

import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';
import auth from '../middleware/auth';
require('dotenv').config();
import { userInterface } from '../types/userInterface';

interface JwtPayload {
  _id: any
}


const router = Router();

import { generateAuthToken, removeItemOnce } from '../services/services';

const refreshTokens: string[] = [];

router.post('/users/register', async (req: Request, res: Response) => {
  req.body.username = req.body.username.toLowerCase();
  const user = new User(req.body);
  try {
    const existWithEmail = await User.findOne({ email: req.body.email });
    if (existWithEmail) {
      return res.status(400).send({ error: 'ასეთი ემაილი უკვე არსებობს' });
    }
    const existWithUsername = await User.findOne({
      username: req.body.username.toLowerCase(),
    });
    if (existWithUsername) {
      return res
        .status(400)
        .send({ error: 'ასეთი მომხმარებელი უკვე არსებობს' });
    }
    await user.save();
    res.status(201).send({ user });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/users/logout', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    removeItemOnce(refreshTokens, refreshToken);
    res.send({ message: 'წარმატებით გამოვიდა' });
  } catch (e) {
    res.status(400).send();
  }
});

router.post('/users/login', async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send({ error: 'ემაილი არასწორია' });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'პაროლი არასწორია' });
    }

    let JWTREFRESHTOKEN: string | undefined
    if (process.env.JWT_REFRESH_TOKEN) {
      JWTREFRESHTOKEN = process.env.JWT_REFRESH_TOKEN
    } else {
      throw new Error("JWT REFRESH TOKEN IS NOT SET")
    }

    const refreshToken = jwt.sign(
      { _id: user._id },
      JWTREFRESHTOKEN,
      { expiresIn: '365d' }
    );
    refreshTokens.push(refreshToken);
    const token = await generateAuthToken(user._id);

    res.send({ user, token, refreshToken });
  } catch (e) {
    res.status(400).send();
  }
});

router.put('/users/update', auth, async (req: userInterface, res: Response) => {
  req.body.username = req.body.username.toLowerCase();
  const existWithEmail = await User.findOne({ email: req.body.email });
  if (existWithEmail) {
    return res.status(400).send({ error: 'ასეთი ემაილი უკვე არსებობს' });
  }
  const existWithUsername = await User.findOne({
    username: req.body.username.toLowerCase(),
  });
  if (existWithUsername) {
    return res.status(400).send({ error: 'მომხმარებელი უკვე არსებობს' });
  }
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 8);
  }
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/renewAccessToken', (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).send({ error: 'No refresh token' });
  }
  let JWTREFRESHTOKEN: string | undefined
  if (process.env.JWT_REFRESH_TOKEN) {
    JWTREFRESHTOKEN = process.env.JWT_REFRESH_TOKEN
  } else {
    throw new Error("JWT REFRESH TOKEN IS NOT SET")
  }

  jwt.verify(refreshToken, JWTREFRESHTOKEN , async (err: any) => {
    if (err) {
      return res.status(401).send({ error: 'Refresh Token Is Expired' });
    }
    const HasRefreshToken = refreshTokens.includes(refreshToken);

    if (!HasRefreshToken) {
      return res.status(401).send({ error: 'Refresh Token Is Invalid' });
    }
    const decoded: any = jwt.decode(refreshToken);
    if(!decoded){
      const userId = decoded._id;
      const token = await generateAuthToken(userId);
      res.send({ refreshToken, token });
    }else{
      return res.status(401).send({ error: 'Refresh Token Is Invalid' });
    }

  });
});

router.get('/users/all', async (req: Request, res: Response) => {
  try {
    const userInfo = await User.find({});
    res.send(userInfo);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/users/me', auth, async (req: userInterface, res: Response) => {
  res.send(req.user);
});

router.get('/users/:username', async (req: Request, res: Response) => {
  const username = req.params.username.toLowerCase();

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send("user doesn't exist");
    }
    res.send(user);
  } catch (e) {
    res.status(500).send();
  }
});

export { router as userRouter };
