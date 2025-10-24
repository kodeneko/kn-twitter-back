export class DbNotFoundException extends Error {
  public readonly name = 'DbNotFound';
  public readonly details?: unknown;

  constructor(message?: string, details?: unknown) {
    super(message ?? "The resource(s) wasn't found");
    this.details = details;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, DbNotFoundException);
    }
  }
}
