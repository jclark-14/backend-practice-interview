-- Users table
CREATE TABLE users (
    userId SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    hashedPassword VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Movies table with user relationship
CREATE TABLE movies (
    movieId SERIAL PRIMARY KEY,
    userId INTEGER REFERENCES users(userId) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    imdbLink VARCHAR(255),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX idx_movies_userId ON movies(userId);