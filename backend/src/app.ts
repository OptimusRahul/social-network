import express from 'express';
import cookieParser from 'cookie-parser';

import { userRouter, friendRequestRouter, notificationRouter, postRouter, feedRouter } from './routes';
import { errorResponseHandler } from './utils/index';
import { appRouter } from './response'

const { INVALID_ROUTE } = appRouter;

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/friendRequests', friendRequestRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/feeds', feedRouter);

app.use('*', (req, res, next) => {
    return next(errorResponseHandler(res, INVALID_ROUTE, 404));
});

export default app;