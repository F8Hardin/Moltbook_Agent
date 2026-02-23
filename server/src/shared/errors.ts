export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const asAppError = (error: unknown): AppError => {
  if (error instanceof AppError) return error;
  if (error instanceof Error) {
    return new AppError('INTERNAL_ERROR', error.message, 500);
  }
  return new AppError('INTERNAL_ERROR', 'Unknown error', 500, error);
};
