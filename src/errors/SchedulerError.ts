import { AppError } from "./AppError";

export class SchedulerError extends AppError {
  constructor(message: string) {
    super(message, "SchedulerError", 500);
  }
}
