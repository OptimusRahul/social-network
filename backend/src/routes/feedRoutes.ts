import { Router } from 'express';

import { isLoggedIn } from '../middlewares';
import { feedsController, profileViewController } from '../controller/feedController';

const feedRouter = Router();

feedRouter.use(isLoggedIn);
feedRouter.get('/get', feedsController);
feedRouter.get('/viewProfile/:user_id', profileViewController);

export { feedRouter };