import path from "path";
import sqlite3 from "sqlite3";

const dbPath = path.join(process.cwd(), "database.db");
const db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the profile database.");
  },
);

db.exec("PRAGMA foreign_keys = ON;", () => {
  console.log("Foreign key support enabled.");
});

const getUserById = (user_id) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM Users WHERE id = ?", [user_id], function (err, rows) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      if (!rows) return reject();
      return resolve(rows);
    });
  });
};

const getUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM Users WHERE username = ? OR email = ?",
      [username, username],
      function (err, rows) {
        if (err) {
          console.log(err);
          return reject(err);
        }
        if (!rows) return reject();
        return resolve(rows);
      },
    );
  });
};

const registerUser = (email, username, password) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO Users (email, username, password) VALUES (?, ?, ?)",
      [email, username, password],
      function (err) {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(this.lastID);
      },
    );
  });
};

const updateUser = (user_id, first_name, last_name) => {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE Users SET first_name = ?, last_name = ? WHERE id = ?",
      [first_name, last_name, user_id],
      function (err) {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve();
      },
    );
  });
};

const setImageUser = (user_id, image_url) => {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE Users SET image = ? WHERE id = ?",
      [image_url, user_id],
      function (err) {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve();
      },
    );
  });
};

const resetImage = (user_id) => {
  return new Promise((resolve, reject) => {
    db.run("UPDATE Users SET image = NULL WHERE id = ?", [user_id], (err) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve();
    });
  });
};

const deleteUser = (user_id) => {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM Users WHERE id = ?", [user_id], (err) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve();
    });
  });
};

const getPost = (post_id, user_id) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM Posts WHERE id = ? AND author = ?",
      [post_id, user_id],
      function (err, rows) {
        if (err) {
          console.log(err);
          return reject(err);
        }
        if (!rows) return reject();
        return resolve(rows);
      },
    );
  });
};

const getPostOffset = (user_id, offset, limit) => {
  return new Promise((resolve, reject) => {
    let query = "SELECT * FROM Posts WHERE author = ? ORDER BY id DESC LIMIT " + limit;
    if (offset && offset > 0) query += " OFFSET " + offset;

    db.all(query + ";", [user_id], function (err, rows) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      if (!rows) return reject();
      return resolve(rows);
    });
  });
};

const createPost = (user_id, title, text) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO Posts (author, title, text) VALUES (?, ?, ?)",
      [user_id, title, text],
      function (err) {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(this.lastID);
      },
    );
  });
};

const deletePost = (post_id, author_id) => {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM Posts WHERE id = ? AND author = ?",
      [post_id, author_id],
      function (err) {
        if (err) {
          console.log(err);
          return reject(err);
        }
        if (this.changes === 0) return reject("unauthorized");
        return resolve();
      },
    );
  });
};

export {
  db,
  getUserById,
  getUserByUsername,
  registerUser,
  updateUser,
  setImageUser,
  resetImage,
  deleteUser,
  getPost,
  deletePost,
  createPost,
  getPostOffset,
};
