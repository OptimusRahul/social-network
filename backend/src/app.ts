import express from 'express';
import cookieParser from 'cookie-parser';

import { userRouter } from './routes/userRoutes';
import { friendRequestRouter } from './routes/friendRequestRoutes';
import { AppError } from './utils/utilites/appError';

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser())

app.use('/api/v1/users', userRouter);
app.use('/api/v1/friendRequest', friendRequestRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find the request URL on this server`, 404));
});

export default app;