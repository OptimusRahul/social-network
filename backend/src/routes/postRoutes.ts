import { Router } from 'express';

import { postSchema, commentSchema, queryParamsSchema } from '../helpers';
import { isLoggedIn, validationMiddleware,  paramsValidation, postVerfification, reactionMiddleware, verifyExisitngFriends } from '../middlewares';
import { createPost, updatePost, deletePost, getPost, getAllPosts } from '../controller/postController';
import { createComment, deleteComment, updateComment } from '../controller/commentController';
import { reactionController } from '../controller/reactionController';

const { createPostSchema, updatePostSchema, reactionSchema } = postSchema;
const { createCommentSchema, updateCommentSchema, deleteCommentSchema } = commentSchema;
const { id } = queryParamsSchema;

const postRouter = Router();

postRouter.use(isLoggedIn);

postRouter.post('/create', validationMiddleware(createPostSchema), verifyExisitngFriends, createPost);
postRouter.get('/get/posts', getAllPosts);
postRouter.get('/get/:id', paramsValidation(id), postVerfification, getPost);
postRouter.patch('/update/:id', paramsValidation(id), validationMiddleware(updatePostSchema), postVerfification, updatePost);
postRouter.delete('/delete/:id', paramsValidation(id), postVerfification, deletePost);

// Reaction Routes
postRouter.post('/reaction', validationMiddleware(reactionSchema), postVerfification, reactionMiddleware, reactionController);

// Comments Routes
postRouter.post('/comments/create', validationMiddleware(createCommentSchema), postVerfification, createComment);
postRouter.patch('/comments/update', validationMiddleware(updateCommentSchema), updateComment);
postRouter.delete('/comments/delete', validationMiddleware(deleteCommentSchema), postVerfification, deleteComment);

export { postRouter };