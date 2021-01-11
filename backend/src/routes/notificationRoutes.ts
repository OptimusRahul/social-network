import { Router } from 'express';

import { protect } from '../middlewares/auth.middleware';
import { verifyRequest } from '../middlewares/friend.request.middleware';
import { getNotification} from '../controller/notificationController';

const notificationRouter = Router();

notificationRouter.use(protect);
notificationRouter.get('/get', getNotification);

export { notificationRouter };