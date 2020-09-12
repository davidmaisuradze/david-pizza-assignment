import { Router } from 'express';
import authenticate from '../middlewares/authenticate';
import { createValidator } from 'express-joi-validation';

import * as UserController from '../controllers/user/user.controller';
import validators from '../controllers/user/user.validators';

const validator = createValidator();

const routes = new Router();

// GET
routes.get('/', authenticate, UserController.getAllUsers);

// POST
routes.post('/', authenticate, validator.body(validators.createUser), UserController.createUser);

// PUT
routes.put('/', authenticate, validator.body(validators.updateUser), UserController.updateUser);

// DELETE
routes.delete('/:userEmail', authenticate, validator.params(validators.deleteUser), UserController.deleteUser);

export default routes;
