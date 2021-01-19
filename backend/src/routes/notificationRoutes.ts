import { Router } from 'express';

import { protect, verifyRequest } from '../middlewares';
import { getNotification} from '../controller/notificationController';

const notificationRouter = Router();

notificationRouter.use(protect);
notificationRouter.get('/get', getNotification);

export { notificationRouter };