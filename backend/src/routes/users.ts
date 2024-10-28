import express from 'express';
import { pool } from '../server';
import { ClientError } from '../middleware/client-error';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { QueryResult } from 'pg';
import { User } from '../types/types';

const router = express.Router();

// Sign Up
router.post('/sign-up', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const userExists: QueryResult<User> = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    if (userExists.rows.length > 0) {
      throw new ClientError(400, 'Username already exists');
    }

    const hashedPassword = await argon2.hash(password);

    const result: QueryResult<User> = await pool.query(
      'INSERT INTO users (username, hashedpassword) VALUES ($1, $2) RETURNING userid, username',
      [username, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(
      err instanceof ClientError
        ? err
        : new ClientError(500, 'Failed to create user')
    );
  }
});

// Sign In
router.post('/sign-in', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const result: QueryResult<User> = await pool.query(
      'SELECT userid, username, hashedpassword FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      throw new ClientError(401, 'Invalid login');
    }

    const user = result.rows[0];
    const isPasswordValid = await argon2.verify(user.hashedpassword, password);

    if (!isPasswordValid) {
      throw new ClientError(401, 'Invalid login');
    }

    // Create token
    const token = jwt.sign(
      { userid: user.userid, username: user.username },
      process.env.TOKEN_SECRET!,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: { userid: user.userid, username: user.username },
    });
  } catch (err) {
    console.error('Sign-in error:', err);
    next(
      err instanceof ClientError
        ? err
        : new ClientError(500, 'Failed to sign in')
    );
  }
});

export default router;
