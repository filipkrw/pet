export class CommandError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommandError";
    Error.captureStackTrace(this, this.constructor);
  }
}
