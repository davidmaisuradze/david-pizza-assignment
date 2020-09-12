import { Router } from 'express';
import path from 'path';

// middleware to log errors
import logError from '../utils/log-error.utils';

// ROUTES
import AuthRoutes from './auth.routes';
import UserRoutes from './user.routes';
import TaskRoutes from './task.routes';

const routes = new Router();

// register routes
routes.use('/auth', AuthRoutes);
routes.use('/user', UserRoutes);
routes.use('/task', TaskRoutes);

routes.all('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

routes.use(logError);

export default routes;
