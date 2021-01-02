import express from 'express';
import cookieParser from 'cookie-parser';

import { userRouter } from './routes/userRoutes';
import { friendRequestRouter } from './routes/friendRequestRoutes';
import { errorResponseHandler } from './utils/index';
import { appRouter } from './errors'

const { INVALID_ROUTE } = appRouter;

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser())

app.use('/api/v1/users', userRouter);
app.use('/api/v1/friendRequest', friendRequestRouter);

app.all('*', (req, res, next) => {
    return next(errorResponseHandler(res, INVALID_ROUTE, 404));
});

export default app;