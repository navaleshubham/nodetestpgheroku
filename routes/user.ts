import { Router } from 'express';
import UserController from '../controllers/user';

const router: Router = Router();
const users: UserController = new UserController();

router.get('/all', users.get);
router.post('/new', users.post);
router.put('/update', users.update);
router.post('/login', users.login)
router.delete('/delete/:id', users.delete);

export default router;
