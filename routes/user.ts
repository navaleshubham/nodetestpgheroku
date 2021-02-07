import express, { Router } from 'express';
import UserController from '../controllers/user';

const router = Router();
const users = new UserController();

router.get('/users', users.get);
router.post('/user',users.post);
router.put('/user',users.update);
router.delete('/user/:id',users.delete)

export default router;