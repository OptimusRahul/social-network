import * as express from 'express';
import { signUp, login, logout, dashBoard } from '../controller/authController';
import { protect, isLoggedIn } from '../middlewares/authMiddleware'

const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', login);
userRouter.get('/logout', logout);

userRouter.get('/dash', protect, dashBoard)

export { userRouter };