import { db } from "../app/lib/database.js";

export const setup = () => {
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
        updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp
    );`,
      (err) => {
        if (err) {
          console.error(err.message);
          return;
        }
        console.log("edit successful.");
      },
    );
  });
};

(() => {
  setup();
})();
