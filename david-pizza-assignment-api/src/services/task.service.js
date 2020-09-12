import TaskModel from '../models/task.model';
import UserModel from '../models/user.model';
import HttpStatus from 'http-status';
import { getHoursFromTwoDates } from '../utils/date.helpers';

export const getAllTasks = async (userEmail, fromDate, toDate) => {
    try {
        let filterObject = {};

        // NOTE: we can't check like !!userEmail, since query params takes null and undefined as strings
        if(userEmail !== 'null' && userEmail !== 'undefined') {
            filterObject={
                ...filterObject,
                userEmail: userEmail
            };
        }

        if(fromDate !== 'null' && fromDate !== 'undefined') {
            filterObject = {
                ...filterObject,
                dateFrom: {
                    ...filterObject.dateFrom,
                    '$gt': new Date(fromDate)
                }
            }
        }

        if(toDate !== 'null' && toDate !== 'undefined') {
            filterObject = {
                ...filterObject,
                dateFrom: {
                    ...filterObject.dateFrom,
                    '$lt': new Date(toDate)
                }
            }
        }

        const tasks = await TaskModel
            .aggregate([
                {
                    $match: filterObject
                },
                {
                    $group: {
                        _id: {$dateToString: {format: '%Y-%m-%d', date: '$dateFrom'}},
                        tasks: {$push: '$$ROOT'},
                        totalWorkedHours: {
                            $sum: '$workedHours'
                        }
                    }
                },
                {'$project': {'_id': 0, 'workedDate': '$_id', 'tasks': 1, 'totalWorkedHours': 1}}
            ]);

        return {status: HttpStatus.OK, data: tasks};
    } catch (err) {
        return {status: HttpStatus.BAD_REQUEST, data: err};
    }
};

export const createTask = async (currentUserEmail, data) => {
    try {
        const {title, description, dateFrom, dateTo, userEmail} = data;

        const email = userEmail || currentUserEmail;

        const user = await UserModel.findOne({email: email});
        if (!user) {
            return {status: HttpStatus.BAD_REQUEST, data: 'user not found'};
        }

        const workedHours = getHoursFromTwoDates(dateFrom, dateTo);

        const newTask = new TaskModel({
            title,
            description,
            dateFrom,
            dateTo,
            workedHours,
            userEmail: email
        });
        const result = await newTask.save();

        return {status: HttpStatus.OK, data: result};
    } catch (err) {
        console.log(err, 'err');
        return {status: HttpStatus.BAD_REQUEST, data: err};
    }
};

export const updateTask = async (currentUserEmail, data) => {
    try {
        const {_id, title, description, dateFrom, dateTo, userEmail} = data;

        const email = userEmail || currentUserEmail;

        const user = await UserModel.findOne({email: email});
        if (!user) {
            return {status: HttpStatus.BAD_REQUEST, data: 'user not found'};
        }

        const workedHours = getHoursFromTwoDates(dateFrom, dateTo);

        const result = await TaskModel.findOneAndUpdate(
            {_id: _id},
            {
                $set: {
                    title,
                    description,
                    dateFrom,
                    dateTo,
                    workedHours,
                    userEmail: email
                }
            },
            {upsert: true, new: true}
        );

        return {status: HttpStatus.OK, data: result};
    } catch (err) {
        return {status: HttpStatus.BAD_REQUEST, data: err};
    }
};

export const deleteTask = async taskId => {
    try {
        const result = await TaskModel.findOneAndDelete({_id: taskId});

        return {status: HttpStatus.OK, data: result};
    } catch (err) {
        return {status: HttpStatus.BAD_REQUEST, data: err};
    }
};
