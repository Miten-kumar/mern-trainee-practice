export const logger = {
  info(message: string): void {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  },

  success(message: string): void {
    console.log(`[SUCCESS] ${new Date().toISOString()} - ${message}`);
  },

  warn(message: string): void {
    console.warn(`[WARNING] ${new Date().toISOString()} - ${message}`);
  },

  error(message: string): void {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
  },
};