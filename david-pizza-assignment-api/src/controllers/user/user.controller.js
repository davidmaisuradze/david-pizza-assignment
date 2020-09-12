import * as userService from '../../services/user.service';

export const getAllUsers = async (req, res, next) => {
    const {status, data} = await userService.getAllUsers(req.currentUser.email);
    return res.status(status).json(data);
};

export const createUser = async (req, res, next) => {
    const {status, data} = await userService.createUser(req.body, req.currentUser.role);
    return res.status(status).json(data);
};

export const updateUser = async (req, res, next) => {
    const {status, data} = await userService.updateUser(req.body, req.currentUser.role);
    return res.status(status).json(data);
};

export const deleteUser = async (req, res, next) => {
    const {status, data} = await userService.deleteUser(req.params.userEmail, req.currentUser.role);
    return res.status(status).json(data);
};
