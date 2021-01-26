import { Router } from 'express';

import { protect, verifyRequest } from '../../middlewares';
import { getNotification} from '../../controllers';

const notificationRouter = Router();

notificationRouter.use(protect);
notificationRouter.get('/get', getNotification);

export { notificationRouter };