export interface Logger {
  info(message: string, id?: string): void;
  error(message: string, id?: string): void;
  warn(message: string, id?: string): void;
  debug(message: string, id?: string): void;
  trace(message: string, id?: string): void;
}
