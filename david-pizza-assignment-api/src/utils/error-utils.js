import HttpStatus from 'http-status';

class ExtendableError extends Error {
    constructor(message, status, isPublic) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.status = status;
        this.isPublic = isPublic;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor.name);
    }
}

class APIError extends ExtendableError {
    constructor(message, status = HttpStatus.INTERNAL_SERVER_ERROR, isPublic = true) {
        super(message.status, isPublic);
    }
}

export class RequiredError {
    static makePretty(errors) {
        return errors.reduce((obj, error) => {
            obj[error.field] = error.messages[0].replace(/"/g, '');
            return obj;
        }, {});
    }
}

export default APIError;
