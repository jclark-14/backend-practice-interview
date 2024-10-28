import express from 'express';
import { pool } from '../server';
import { Movie } from '../types/types';
import { ClientError } from '../middleware/client-error';
import { QueryResult } from 'pg';

const router = express.Router();

// GET all movies
router.get('/', async (req, res, next) => {
  try {
    const result: QueryResult<Movie> = await pool.query(
      'SELECT movieid, userid, title, summary, imdblink, rating, createdat, updatedat FROM movies ORDER BY createdat DESC'
    );
    res.json(result.rows);
  } catch (err) {
    next(new ClientError(500, 'Failed to retrieve movies'));
  }
});

// POST new movie
router.post('/', async (req, res, next) => {
  const { title, summary, imdbLink, rating, userId } = req.body;
  try {
    const result: QueryResult<Movie> = await pool.query(
      'INSERT INTO movies (title, summary, imdblink, rating, userid) VALUES ($1, $2, $3, $4, $5) RETURNING movieid, userid, title, summary, imdblink, rating, createdat, updatedat',
      [title, summary, imdbLink, rating, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(new ClientError(500, 'Failed to add movie'));
  }
});

// PUT update movie
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { title, summary, imdbLink, rating } = req.body;
  try {
    const result: QueryResult<Movie> = await pool.query(
      'UPDATE movies SET title = $1, summary = $2, imdblink = $3, rating = $4, updatedat = CURRENT_TIMESTAMP WHERE movieid = $5 RETURNING movieid, userid, title, summary, imdblink, rating, createdat, updatedat',
      [title, summary, imdbLink, rating, id]
    );
    if (result.rows.length === 0) {
      throw new ClientError(404, 'Movie not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(
      err instanceof ClientError
        ? err
        : new ClientError(500, 'Failed to update movie')
    );
  }
});

// DELETE movie
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const result: QueryResult<Movie> = await pool.query(
      'DELETE FROM movies WHERE movieid = $1 RETURNING movieid',
      [id]
    );
    if (result.rows.length === 0) {
      throw new ClientError(404, 'Movie not found');
    }
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    next(
      err instanceof ClientError
        ? err
        : new ClientError(500, 'Failed to delete movie')
    );
  }
});

export default router;
