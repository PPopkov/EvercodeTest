export class AppError extends Error {
  statusCode: number;
  timestamp: Date;

  constructor(message: string, name: string, statusCode: number) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.timestamp = new Date();
  }
}
