export const log = (module: string, message: string, context?: Record<string, unknown>): void => {
  const payload = { module, message, ...context };
  console.log(JSON.stringify(payload));
};

export const errorLog = (module: string, message: string, context?: Record<string, unknown>): void => {
  const payload = { level: 'error', module, message, ...context };
  console.error(JSON.stringify(payload));
};
