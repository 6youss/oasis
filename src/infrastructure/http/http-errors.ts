export class HttpError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = "BadRequest") {
    super(message, 400);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string = "Conflict") {
    super(message, 409);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = "NotFound") {
    super(message, 404);
  }
}
