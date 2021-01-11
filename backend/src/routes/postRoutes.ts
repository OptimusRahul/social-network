import { Router } from 'express';

import { postSchema } from '../helpers'
import { isLoggedIn } from '../middlewares/auth.middleware';
import { postVerfification, reactionVerification } from '../middlewares/post.middleware';
import { createPost, addReaction, updatePost, deletePost, getPost } from '../controller/postController';

const {  } = postSchema;

const postRouter = Router();

postRouter.use(isLoggedIn, postVerfification);
postRouter.get('/post/:id', getPost);
postRouter.post('/post/:id', createPost);
postRouter.patch('/post/:id', updatePost);
postRouter.delete('/post/:id', deletePost);

postRouter.post('/post/reaction/:id', reactionVerification, addReaction);



export { postRouter };