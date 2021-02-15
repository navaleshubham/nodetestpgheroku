import { Router } from 'express';
import UserController from '../controllers/user';

const router: Router = Router();
const EMPLOYEE: UserController = new UserController();

router.get('/all', EMPLOYEE.get);
router.post('/new', EMPLOYEE.post);
router.put('/update', EMPLOYEE.update);
router.post('/login', EMPLOYEE.login);
router.delete('/delete/:id', EMPLOYEE.delete);

export default router;
