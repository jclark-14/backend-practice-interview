import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import moviesRouter from './routes/movies';
import { errorMiddleware } from './middleware/error-middleware';
import userRouter from './routes/users';
import { authMiddleware } from './middleware/auth-middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
});

app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
app.use(express.json());

// Public routes
app.use('/api/users', userRouter);

// Protected routes - use authMiddleware
app.use('/api/movies', authMiddleware, moviesRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
