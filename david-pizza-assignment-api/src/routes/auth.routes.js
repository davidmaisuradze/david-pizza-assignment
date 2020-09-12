import { Router } from 'express';
import authenticate from '../middlewares/authenticate';
import { createValidator } from 'express-joi-validation';

import * as AuthController from '../controllers/auth/auth.controller';
import validators from '../controllers/auth/auth.validators';

const validator = createValidator();

const routes = new Router();

// POST
routes.post('/login', validator.body(validators.login), AuthController.login);
routes.post('/register', validator.body(validators.register), AuthController.register);

// PUT
routes.put('/update-preferred-hours',
    authenticate,
    validator.body(validators.updatePreferredWorkingHours),
    AuthController.updatePreferredWorkingHours
);

export default routes;
