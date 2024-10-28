import { Request } from 'express';

export interface User {
  userid: number;
  username: string;
  hashedpassword: string;
  createdat?: Date;
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        username: string;
      };
    }
  }
}

export interface Movie {
  movieid: number;
  userid: number;
  title: string;
  summary: string | null;
  imdblink: string | null;
  rating: number;
  createdat: Date;
  updatedat: Date;
}
