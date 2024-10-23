CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    image_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
    updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS Posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author INTEGER NOT NULL,
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp,

  FOREIGN KEY (author) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TRIGGER update_timestamp
AFTER UPDATE ON Users
FOR EACH ROW
BEGIN
  UPDATE Users SET updated_at = current_timestamp WHERE id = old.id;
END;

CREATE TRIGGER update_timestamp_post
AFTER UPDATE ON Posts
FOR EACH ROW
BEGIN
  UPDATE Posts SET updated_at = current_timestamp WHERE id = old.id;
END;
