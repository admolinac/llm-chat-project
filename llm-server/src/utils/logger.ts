import winston from 'winston';

export const createLogger = (filename: string) => {
  const moduleName = filename
    .replace(process.cwd(), '')
    .replace(/\\/g, '/')
    .replace('/src/', '')
    .replace('.ts', '')
    .replace('.js', '');

  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
        const logMessage = `${timestamp} [${level.toUpperCase()}] [${moduleName}] ${message}`;
        return stack
          ? `${logMessage}\n${stack}`
          : `${logMessage} ${metaString}`;
      })
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        ),
      }),
    ],
  });
};
