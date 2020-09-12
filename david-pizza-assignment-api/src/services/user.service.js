import UserModel from '../models/user.model';
import HttpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import { ROLES } from '../config/constants';

export const getAllUsers = async (currentUserEmail) => {
    try {
        const users = await UserModel
            .find({"email": {"$ne": currentUserEmail}})
            .select('_id email firstName lastName role preferredWorkingHourFrom preferredWorkingHourTo')
            .sort('-createdAt');

        return {status: HttpStatus.OK, data: users};
    } catch (err) {
        return {status: HttpStatus.BAD_REQUEST, data: err};
    }
};

export const createUser = async (data, currentUserRole) => {
    try {
        const {email, password, confirmedPassword, firstName, lastName, role} = data;

        if(currentUserRole === ROLES.user) {
            return {status: HttpStatus.FORBIDDEN, data: 'permission denied'};
        }

        if (password !== confirmedPassword) {
            return {status: HttpStatus.BAD_REQUEST, data: 'passwords not match'};
        }

        const user = await UserModel.findOne({email: email});
        if (user) {
            return {status: HttpStatus.BAD_REQUEST, data: 'user already exists'};
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = bcrypt.hashSync(password, salt);

        const newUser = new UserModel({
            email,
            firstName,
            lastName,
            passwordHash,
            role
        });
        const result = await newUser.save();

        return {status: HttpStatus.OK, data: result};
    } catch (err) {
        console.log(err, 'err');
        return {status: HttpStatus.BAD_REQUEST, data: err};
    }
};

export const updateUser = async (data, currentUserRole) => {
    try {
        const {email, firstName, lastName, role} = data;

        if(currentUserRole === ROLES.user) {
            return {status: HttpStatus.FORBIDDEN, data: 'permission denied'};
        }

        const result = await UserModel.findOneAndUpdate(
            {email: email},
            {
                $set: {
                    firstName,
                    lastName,
                    role
                }
            },
            {upsert: true, new: true}
        );

        return {status: HttpStatus.OK, data: result};
    } catch (err) {
        return {status: HttpStatus.BAD_REQUEST, data: err};
    }
};

export const deleteUser = async (userEmail, currentUserRole) => {
    try {
        const result = await UserModel.findOneAndDelete({email: userEmail});

        if(currentUserRole === ROLES.user) {
            return {status: HttpStatus.FORBIDDEN, data: 'permission denied'};
        }

        return {status: HttpStatus.OK, data: result};
    } catch (err) {
        return {status: HttpStatus.BAD_REQUEST, data: err};
    }
};
