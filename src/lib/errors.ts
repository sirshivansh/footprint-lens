// ─── Custom Error Classes ───

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, "VALIDATION_ERROR", 400, details);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Insufficient permissions") {
    super(message, "FORBIDDEN", 403);
    this.name = "ForbiddenError";
  }
}

export class PremiumRequiredError extends AppError {
  constructor(feature: string) {
    super(`${feature} requires a premium subscription`, "PREMIUM_REQUIRED", 403);
    this.name = "PremiumRequiredError";
  }
}

export class RateLimitedError extends AppError {
  constructor(retryAfterSeconds?: number) {
    super(
      "Too many requests. Please try again later.",
      "RATE_LIMITED",
      429,
      retryAfterSeconds ? { retryAfter: retryAfterSeconds } : undefined
    );
    this.name = "RateLimitedError";
  }
}

export class UpstreamError extends AppError {
  constructor(service: string) {
    super(`${service} service is temporarily unavailable`, "UPSTREAM_ERROR", 502);
    this.name = "UpstreamError";
  }
}
