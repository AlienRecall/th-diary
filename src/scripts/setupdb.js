import { db } from "../app/lib/database.js";

export const setup = () => {
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        first_name TEXT,
        last_name TEXT,
        image TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
        updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp
    );`,
      (err) => {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log("created Users.");
      },
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS Posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author INTEGER NOT NULL,
        title TEXT NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
        updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
      
        FOREIGN KEY (author) REFERENCES Users(id) ON DELETE CASCADE
      );`,
      (err) => {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log("created Posts.");
      },
    );

    db.run(
      `CREATE TRIGGER update_timestamp
      AFTER UPDATE ON Users
      FOR EACH ROW
      BEGIN
        UPDATE Users SET updated_at = current_timestamp WHERE id = old.id;
      END;`,
      (err) => {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log("created update_timestamp trigger.");
      },
    );

    db.run(
      `CREATE TRIGGER update_timestamp_post
      AFTER UPDATE ON Posts
      FOR EACH ROW
      BEGIN
        UPDATE Posts SET updated_at = current_timestamp WHERE id = old.id;
      END;`,
      (err) => {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log("created update_timestamp_post trigger.");
      },
    );
  });
};

(() => {
  setup();
})();
