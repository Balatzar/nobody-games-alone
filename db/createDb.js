const db = require("../db");

(async function() {
  const res = await db.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    DROP TABLE IF EXISTS games_users;
    DROP TABLE IF EXISTS timeslots_users;
    DROP TABLE IF EXISTS games_users_platforms;
    DROP TABLE IF EXISTS games;
    DROP TABLE IF EXISTS timeslots;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS platforms;

    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      temp_token uuid DEFAULT uuid_generate_v4(),
      username VARCHAR(100) NOT NULL UNIQUE
    );
    CREATE INDEX idx_user_temp_token
    ON users(temp_token);

    CREATE TABLE games (
      id SERIAL PRIMARY KEY,
      name VARCHAR NOT NULL UNIQUE,
      igdb_id VARCHAR NOT NULL UNIQUE
    );

    CREATE TABLE platforms (
      id SERIAL PRIMARY KEY,
      name VARCHAR NOT NULL UNIQUE,
      igdb_id VARCHAR NOT NULL UNIQUE,
      abbreviation VARCHAR,
      category INT
    );

    CREATE TABLE games_users (
      game_id INT,
      user_id INT,
      CONSTRAINT fk_game
        FOREIGN KEY(game_id)
          REFERENCES games(id),
      CONSTRAINT fk_user
        FOREIGN KEY(user_id)
          REFERENCES users(id)
    );

    CREATE TABLE games_users_platforms (
      game_id INT,
      user_id INT,
      platform_id INT,
      CONSTRAINT fk_game
        FOREIGN KEY(game_id)
          REFERENCES games(id),
      CONSTRAINT fk_user
        FOREIGN KEY(user_id)
          REFERENCES users(id),
      CONSTRAINT fk_platform
        FOREIGN KEY(platform_id)
          REFERENCES platforms(id)
    );

    CREATE TABLE timeslots (
      id SERIAL PRIMARY KEY,
      start_time TIMESTAMPTZ NOT NULL,
      end_time TIMESTAMPTZ NOT NULL,
      user_id INT,
      CONSTRAINT fk_user
        FOREIGN KEY(user_id)
          REFERENCES users(id)
    );
  `);
  console.log(res);

  process.exit();
})();
