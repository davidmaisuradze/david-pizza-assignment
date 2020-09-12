import UserModel from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import HttpStatus from 'http-status';
import { ROLES } from '../config/constants';

export const login = async (email, password) => {
    try {
        const user = await UserModel.findOne({email: email});

        if (!user) {
            return {status: HttpStatus.BAD_REQUEST, data: 'user not found'};
        }

        if (user && bcrypt.compareSync(password, user.passwordHash)) {
            const generatedJWT = jwt.sign({
                email: email
            }, process.env.JWT_SECRET, {expiresIn: '1h'});

            const userToAuthJson = {
                token: generatedJWT,
                user: {
                    email: email,
                    ...user.toObject()
                }
            };
            return {status: HttpStatus.OK, data: userToAuthJson};
        } else {
            return {status: HttpStatus.BAD_REQUEST, data: 'Invalid credentials'};
        }
    } catch (err) {
        console.log(err, 'err');
        return {status: HttpStatus.BAD_REQUEST, data: err};
    }
};

export const register = async (data) => {
    try {
        const {email, password, confirmedPassword, firstName, lastName} = data;

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
            email: email,
            firstName: firstName,
            lastName: lastName,
            passwordHash: passwordHash,
            role: ROLES.user // assign default user role to newly registered user
        });
        const result = await newUser.save();

        return {status: HttpStatus.OK, data: result};
    } catch (err) {
        console.log(err, 'err');
        return {status: HttpStatus.BAD_REQUEST, data: err};
    }
};

export const updatePreferredWorkingHours = async (hourFrom, hourTo, email) => {
    try {
        const user = await UserModel.findOne({email: email});
        if (!user) {
            return {status: HttpStatus.BAD_REQUEST, data: 'user not found'};
        }

        const result = await UserModel.findOneAndUpdate(
            {email: email},
            {
                $set: {
                    preferredWorkingHourFrom: hourFrom,
                    preferredWorkingHourTo: hourTo
                }
            },
            {upsert: true, new: true}
        );

        return {status: HttpStatus.OK, data: result};
    } catch (err) {
        console.log(err, 'err');
        return {status: HttpStatus.BAD_REQUEST, data: err};
    }
};
