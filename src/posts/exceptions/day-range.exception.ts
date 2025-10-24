export class DayRangeException extends Error {
  public readonly name = 'DayRangeException';
  public readonly details?: unknown;

  constructor(message?: string, details?: unknown) {
    super(message ?? 'The day range is between 1 and 7');
    this.details = details;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, DayRangeException);
    }
  }
}
