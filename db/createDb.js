const db = require("../db");

(async function() {
  const res = await db.query(`
    DROP TABLE IF EXISTS games;
    CREATE TABLE games (
      id SERIAL PRIMARY KEY,
      name VARCHAR NOT NULL UNIQUE,
      igdb_id VARCHAR NOT NULL UNIQUE
    );

    DROP TABLE IF EXISTS timeslots;
    CREATE TABLE timeslots (
      id SERIAL PRIMARY KEY,
      start_time TIMESTAMPTZ NOT NULL,
      end_time TIMESTAMPTZ NOT NULL
    )
  `);
  console.log(res);

  process.exit();
})();
