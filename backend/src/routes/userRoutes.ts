import * as express from 'express';
import { signUp, login, dashBoard } from '../controller/authController';
import { protect } from '../middlewares/authMiddleware'

const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', login);

userRouter.get('/dash', protect, dashBoard)

export { userRouter };