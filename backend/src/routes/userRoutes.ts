import express from 'express';

import { signUp, login, logout, fogotPassword, resetPassword, updatePassword } from '../controller/authController';
import { getAllUsers } from '../controller/userController';
import { protect } from '../middlewares/auth.middleware'

const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', login);
userRouter.get('/logout', logout);
userRouter.post('/forgotPassword', fogotPassword);
userRouter.patch('/resetPassword/:token', resetPassword);

userRouter.use(protect);
userRouter.get('/getUsers', getAllUsers)
userRouter.patch('/updateMyPassword', updatePassword);

export { userRouter };