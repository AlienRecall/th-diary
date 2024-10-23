import { db } from "../app/lib/database.js";

export const setup = () => {
  db.serialize(() => {
    db.run(
      `ALTER TABLE Posts
      ADD COLUMN title TEXT NOT NULL;`,
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
