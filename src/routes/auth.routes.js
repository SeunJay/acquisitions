import { signUp } from '#controllers/auth.controller.js';
import express from 'express';

const router = express.Router();

router.post('/sign-up', signUp);

router.post('/sign-in', (req, res) => {
  res.send('signing in');
});

router.post('/sign-out', (req, res) => {
  res.send('signing out');
});

export default router;
