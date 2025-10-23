export class TwErrorLimitsException extends Error {
  public readonly name = 'TwErrorLimitsException';
  public readonly details?: unknown;

  constructor(message?: string, details?: unknown) {
    super(message ?? 'The limit Twitter API using was exceded');
    this.details = details;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, TwErrorLimitsException);
    }
  }
}
