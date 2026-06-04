declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId?: string | null;
      };
    }
  }
}

export {};
