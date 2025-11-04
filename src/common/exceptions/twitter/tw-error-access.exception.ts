export class TwErrorAccessException extends Error {
  public readonly name = 'TwErrorAccess';
  public readonly details?: unknown;

  constructor(message?: string, details?: unknown) {
    super(message ?? 'You have not the apropiate level access');
    this.details = details;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, TwErrorAccessException);
    }
  }
}
