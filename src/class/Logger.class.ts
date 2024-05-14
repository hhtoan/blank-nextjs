class Logger {
  static log(message: string): void {
    console.log(message);
  }
  static throwError(message: string): void {
    throw new Error(message);
  }
}
export default Logger;
