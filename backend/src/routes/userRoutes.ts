import { Router } from 'express';

import { authSchema } from '../helpers';
import { protect } from '../middlewares/auth.middleware'
import { validationMiddleware } from '../middlewares/data.validation.middleware';
import { signUp, login, logout, fogotPassword, resetPassword, updatePassword } from '../controller/authController';
import { getAllUsers, getUser, updateUser, deleteUser } from '../controller/userController';

const { 
    signUpSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    updatePasswordSchema,
    updateUserSchema
} = authSchema;

const userRouter = Router();

userRouter.post('/signup', validationMiddleware(signUpSchema), signUp);
userRouter.post('/login', validationMiddleware(loginSchema), login);
userRouter.get('/logout', logout);
userRouter.post('/forgotPassword', validationMiddleware(forgotPasswordSchema), fogotPassword);
userRouter.patch('/resetPassword/:token', validationMiddleware(resetPasswordSchema), resetPassword); 


userRouter.use(protect);
userRouter.get('/getUsers', getAllUsers)
userRouter.get('/getUser', getUser);
userRouter.patch('/updatePassword', validationMiddleware(updatePasswordSchema), updatePassword);
userRouter.patch('/updateUser', validationMiddleware(updatePasswordSchema), updateUser);
userRouter.delete('/deleteUser', deleteUser);

export { userRouter };