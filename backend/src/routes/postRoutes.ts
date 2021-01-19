import { Router } from 'express';

import { postSchema, queryParamsSchema } from '../helpers';
import { isLoggedIn, validationMiddleware,  paramsValidation, postVerfification, reactionVerification, verifyExisitngUser } from '../middlewares';
import { createPost, updatePost, deletePost, getPost } from '../controller/postController';

const { createPostSchema, updatePostSchema, reactionSchema } = postSchema;
const { id } = queryParamsSchema;

const postRouter = Router();

postRouter.use(isLoggedIn);
postRouter.post('/create', validationMiddleware(createPostSchema), verifyExisitngUser, createPost);

postRouter.get('/get/:id', paramsValidation(id), postVerfification, getPost);
postRouter.patch('/update/:id', paramsValidation(id), validationMiddleware(updatePostSchema), postVerfification, updatePost);
postRouter.delete('/delete/:id', paramsValidation(id), postVerfification, deletePost);

// postRouter.post('/reaction/:id', paramsValidation(id), validationMiddleware(reactionSchema), postVerfification, addReaction);

export { postRouter };