import { Router } from 'express';

import { commentSchema } from '../helpers';
import { isLoggedIn, postVerfification, validationMiddleware } from '../middlewares';
import { createComment, deleteComment, updateComment } from '../controller/commentController';

const { createCommentSchema, updateCommentSchema, deleteCommentSchema } = commentSchema;

const commentRouter = Router();

commentRouter.use(isLoggedIn);
commentRouter.post('/create', validationMiddleware(createCommentSchema), postVerfification, createComment);
commentRouter.patch('/update', validationMiddleware(updateCommentSchema), updateComment);
commentRouter.delete('/delete', validationMiddleware(deleteCommentSchema), deleteComment);

export { commentRouter };