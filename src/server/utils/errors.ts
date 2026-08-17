export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: any;

  constructor(message: string, statusCode: number = 500, code: string = "INTERNAL_SERVER_ERROR", details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "UNAUTHENTICATED");
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Access denied for this resource") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class PaymentError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 422, "PAYMENT_PROCESSING_ERROR", details);
  }
}
