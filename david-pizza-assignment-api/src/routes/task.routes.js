import { Router } from 'express';
import authenticate from '../middlewares/authenticate';
import { createValidator } from 'express-joi-validation';

import * as TaskController from '../controllers/task/task.controller';
import validators from '../controllers/task/task.validators';

const validator = createValidator();

const routes = new Router();

// GET
routes.get('/', authenticate, TaskController.getAllTasks);
routes.get('/html-sheet', authenticate, TaskController.getHtmlSheet);

// POST
routes.post('/', authenticate, validator.body(validators.createTask), TaskController.createTask);

// PUT
routes.put('/', authenticate, validator.body(validators.updateTask), TaskController.updateTask);

// DELETE
routes.delete('/:taskId', authenticate, validator.params(validators.deleteTask), TaskController.deleteTask);

export default routes;
