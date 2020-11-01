const db = require("../db");

(async function() {
  const res = await db.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
    );

    DROP TABLE IF EXISTS users;
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      temp_token uuid DEFAULT uuid_generate_v4(),
      username VARCHAR(100) NOT NULL UNIQUE
    );
    CREATE INDEX idx_user_temp_token
    ON users(temp_token);
  `);
  console.log(res);

  process.exit();
})();
