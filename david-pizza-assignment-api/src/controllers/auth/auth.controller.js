import * as authService from '../../services/auth.service';

export const login = async (req, res, next) => {
    const {email, password} = req.body;
    const {status, data} = await authService.login(email, password);
    return res.status(status).json(data);
};

export const register = async (req, res, next) => {
    const {status, data} = await authService.register(req.body);
    return res.status(status).json(data);
};

export const updatePreferredWorkingHours=async(req, res, next) => {
    const {hourFrom, hourTo} = req.body;
    const {status, data} = await authService.updatePreferredWorkingHours(hourFrom, hourTo, req.currentUser.email);
    return res.status(status).json(data);
}
