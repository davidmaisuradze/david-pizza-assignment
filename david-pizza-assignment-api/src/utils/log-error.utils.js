import HttpStatus from 'http-status';
import APIError, { RequiredError } from './error-utils';

export default (err, req, res, next) => {
    if (!err) {
        return new APIError('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const error = {
        message: err.message || 'Internal Server Error.'
    };

    if (err.errors) {
        error.errors = {};
        const {errors} = err;
        if (Array.isArray(errors)) {
            error.errors = RequiredError.makePretty(errors);
        } else {
            Object.keys(errors).forEach(key => {
                error.errors[key] = errors[key].message;
            });
        }
    }

    res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error);

    return next();
}
