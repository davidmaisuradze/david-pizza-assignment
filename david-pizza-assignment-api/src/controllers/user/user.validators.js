import Joi from 'joi';

export default {
    createUser: Joi.object({
        email: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        password: Joi.string().required(),
        confirmedPassword: Joi.string().required(),
        role: Joi.string().required()
    }),
    updateUser: Joi.object({
        email: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        role: Joi.string().required()
    }),
    deleteUser: Joi.object({
        userEmail: Joi.string().required()
    })
}
