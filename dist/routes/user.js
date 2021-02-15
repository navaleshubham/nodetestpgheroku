import { Router } from 'express';
import UserController from '../controllers/user.js';
const router = Router();
const EMPLOYEE = new UserController();
router.get('/all', EMPLOYEE.get);
router.post('/new', EMPLOYEE.post);
router.put('/update', EMPLOYEE.update);
router.post('/login', EMPLOYEE.login);
router.delete('/delete/:id', EMPLOYEE.delete);
export default router;
//# sourceMappingURL=user.js.map