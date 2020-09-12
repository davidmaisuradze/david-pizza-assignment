import * as taskService from '../../services/task.service';
import HttpStatus from 'http-status';
import { format } from 'date-fns';
import pug from 'pug';
import path from 'path';

export const getAllTasks = async (req, res, next) => {
    const {userEmail, dateFrom, dateTo} = req.query;
    const email = !!userEmail && userEmail !== 'null' && userEmail !== 'undefined' ? userEmail : req.currentUser.email;
    const {status, data} = await taskService.getAllTasks(email, dateFrom, dateTo);
    return res.status(status).json(data);
};

export const getHtmlSheet = async (req, res, next) => {
    const {userEmail, dateFrom, dateTo} = req.query;
    const currentUser = req.currentUser;
    const email = !!userEmail && userEmail !== 'null' && userEmail !== 'undefined' ? userEmail : currentUser.email;
    const {status, data} = await taskService.getAllTasks(email, dateFrom, dateTo);

    if (status === HttpStatus.OK) {
        const renderedReport = pug.renderFile(path.join(__dirname, '../../../views/notes/notes-report.pug'), {
            notes: data,
            formatDate: (dateString) => format(new Date(dateString), 'HH:mm'),
            getHoursAndMinutesInSeconds: (dateString) => {
                const date = new Date(dateString);
                return date.getHours() * 3600 + date.getMinutes() * 60;
            },
            preferredWorkingHourFrom: currentUser.preferredWorkingHourFrom,
            preferredWorkingHourTo: currentUser.preferredWorkingHourTo
        });

        res.write(renderedReport);
        return res.end();
    } else {
        return res.status(status).json(data);
    }
}

export const createTask = async (req, res, next) => {
    const {currentUser, body} = req;

    const {status, data} = await taskService.createTask(currentUser.email, body);
    return res.status(status).json(data);
};

export const updateTask = async (req, res, next) => {
    const {currentUser, body} = req;

    const {status, data} = await taskService.updateTask(currentUser.email, body);
    return res.status(status).json(data);
};

export const deleteTask = async (req, res, next) => {
    const {status, data} = await taskService.deleteTask(req.params.taskId);
    return res.status(status).json(data);
};
