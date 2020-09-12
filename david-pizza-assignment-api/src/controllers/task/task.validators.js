import Joi from 'joi';

export default {
    getTasks: Joi.object({
       userEmail: Joi.string(),
       dateFrom: Joi.string(),
       dateTo: Joi.string()
    }),
    createTask: Joi.object({
        userEmail: Joi.string().email().allow(null, ''),
        title: Joi.string().required(),
        description: Joi.string().required(),
        dateFrom: Joi.string().required(),
        dateTo: Joi.string().required(),
    }),
    updateTask: Joi.object({
        _id: Joi.string().required(),
        userEmail: Joi.string().email().allow(null, ''),
        title: Joi.string().required(),
        description: Joi.string().required(),
        dateFrom: Joi.string().required(),
        dateTo: Joi.string().required(),
    }),
    deleteTask: Joi.object({
        taskId: Joi.string().required()
    })
}
