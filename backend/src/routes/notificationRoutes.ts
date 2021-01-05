import { Router } from 'express';

import { protect } from '../middlewares/auth.middleware';
import { verifyRequest } from '../middlewares/friend.request.middleware';
import { getNotificationController} from '../controller/notificationController';

const notificationRouter = Router();

notificationRouter.use(protect);
notificationRouter.get('/get', getNotificationController);

export { notificationRouter };