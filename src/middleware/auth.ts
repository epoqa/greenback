const jwt = require('jsonwebtoken');
const User = require('../models/user');
import express, { Application, Request, Response, NextFunction, Router } from 'express';

require('dotenv').config();
import { userInterface } from '../types/userInterface';

const auth = async (req: userInterface, res: Response, next: NextFunction) => {
  try {
    if(req.header('Authorization')) {
      let token: string | undefined | object = req.header('Authorization')
      if(token) {
        token = token.replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const user = await User.findById(decoded._id);
    
        if (!user) {
          throw new Error();
        } 
        req.token = token;
        req.user = user;
        next();
      }
    }
    return res.status(401).send({ error: 'ჰედერი არის ანდეფაინდი' });

  } catch (e) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

export = auth;
