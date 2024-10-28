TRUNCATE TABLE movies, users RESTART IDENTITY CASCADE;

-- Insert sample users
INSERT INTO users (username, hashedPassword) VALUES
  -- In real app, these would be properly hashed passwords, using 'password123' as example
  ('testuser1', '$2a$10$Vt5YOg0yZ9W4AiO6VT3MgOUB4spUZU8.9KG.DI9iVmdN5m4CZWoZ.'),
  ('moviefan42', '$2a$10$Vt5YOg0yZ9W4AiO6VT3MgOUB4spUZU89KG.DI9iVmdN5m4CZWoZ.');

-- Insert sample movies
INSERT INTO movies (userId, title, summary, imdbLink, rating) VALUES
  (1, 'The Matrix', 'A computer programmer discovers a mysterious world beneath everyday reality', 'https://www.imdb.com/title/tt0133093/', 5),
  (1, 'Inception', 'A thief who steals corporate secrets through dream-sharing technology', 'https://www.imdb.com/title/tt1375666/', 4),
  (2, 'The Shawshank Redemption', 'Two imprisoned men bond over a number of years', 'https://www.imdb.com/title/tt0111161/', 5);