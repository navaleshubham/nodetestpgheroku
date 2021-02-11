import { Router } from 'express';
import UserController from '../controllers/user';
const router = Router();
const users = new UserController();
router.get('/all', users.get);
router.post('/new', users.post);
router.put('/update', users.update);
router.delete('/delete/:id', users.delete);
export default router;
//# sourceMappingURL=user.js.map