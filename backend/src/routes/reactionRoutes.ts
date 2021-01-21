import { Router } from 'express';
import { isLoggedIn } from '../middlewares';


import { reactionOperation } from '../controller/reactionController';

const reactionRouter = Router();

reactionRouter.use(isLoggedIn);

reactionRouter.post('/reaction', reactionOperation);

export { reactionRouter };