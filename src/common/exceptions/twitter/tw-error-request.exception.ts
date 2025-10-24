export class TwErrorRequestException extends Error {
  public readonly name = 'TwErrorRequestException';
  public readonly details?: unknown;

  constructor(message?: string, details?: unknown) {
    super(message ?? 'Twitter request error');
    this.details = details;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, TwErrorRequestException);
    }
  }
}
