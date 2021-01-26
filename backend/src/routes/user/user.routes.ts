import { Router } from 'express';

import { validationMiddleware, protect } from '../../middlewares';
import { authSchema } from '../../helpers';
import { signUp, login, logout, fogotPassword, resetPassword, updatePassword, 
         getAllUsers, getUser, updateUser, deleteUser, deleteFriend } from '../../controllers';

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
userRouter.post('/forgotPassword', validationMiddleware(forgotPasswordSchema), fogotPassword);
userRouter.patch('/resetPassword/:token', validationMiddleware(resetPasswordSchema), resetPassword); 
userRouter.get('/logout', logout);

userRouter.use(protect);
userRouter.get('/getUsers', getAllUsers)
userRouter.get('/getUser', getUser);
userRouter.patch('/updatePassword', validationMiddleware(updatePasswordSchema), updatePassword);
userRouter.patch('/updateUser', validationMiddleware(updateUserSchema), updateUser);
userRouter.delete('/deleteUser', deleteUser);
userRouter.delete('/friend/:fid', deleteFriend)

export { userRouter };