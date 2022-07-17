const { logger } = require("./logger");



class CustomError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

class NotFoundError extends CustomError {
  constructor(message) {
    super(message, 404);
  }
}

class BadRequestError extends CustomError {
  constructor(message) {
    super(message, 400);
  }
}

class UnauthorizedError extends CustomError {
    constructor(message) {
      super(message, 401);
    }
  }

  class ForbiddenError extends CustomError {
    constructor(message) {
      super(message, 403);
    }
  }

const getStatusCode = (err) => {
  if (err instanceof CustomError) {
    return err.statusCode;
  } else {
    return 500;
  }
};

const getErrorMessage = (err) => {
  if (err instanceof CustomError) {
    return err.message;
  } else {
    //Add Error Logger to trace error internally
    logger.error(err.message, err);

    //Use this generic error message so users wont see error message like "undefined" or DB error
    return "Some error occurred";
  }
};

module.exports = {
  BadRequestError,
  CustomError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  getStatusCode,
  getErrorMessage,
};
