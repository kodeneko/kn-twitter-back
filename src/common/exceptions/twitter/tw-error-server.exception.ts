export class TwErrorServerException extends Error {
  public readonly name = 'TwErrorServerException';
  public readonly details?: unknown;

  constructor(message?: string, details?: unknown) {
    super(message ?? 'Twitter server error');
    this.details = details;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, TwErrorServerException);
    }
  }
}
