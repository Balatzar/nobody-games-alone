const db = require("../db");

(async function() {
  const res = await db.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
      slug VARCHAR NOT NULL UNIQUE,
      abbreviation VARCHAR,
      category INT
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


    INSERT INTO users (username)
      VALUES ('Balthazar'), ('Jean-Balthazar');
    
    INSERT INTO games (name, igdb_id)
      VALUES
      ('The Witcher: Monster Slayer', '137125'),
      ('The Witcher 3: Wild Hunt', '1942'),
      ('Sid Meier''s Civilization: Beyond Earth', '6038');
    
    INSERT INTO platforms (name, igdb_id, abbreviation, category, slug)
      VALUES
      ('Xbox One', '49', 'XONE', 1, 'xboxone'),
      ('PC (Microsoft Windows)', '6', 'PC', 4, 'win'),
      ('Linux', '3', 'Linux', 4, 'linux'),
      ('iOS', '39', 'iOS', 4, 'ios');
    
    INSERT INTO games_users_platforms (game_id, user_id, platform_id)
      VALUES
      (1, 1, 4),
      (2, 1, 1),
      (3, 2, 2),
      (3, 2, 3);
    
    INSERT INTO timeslots (start_time, end_time, user_id)
      VALUES
      ('2020-11-03 02:30:00+01', '2020-11-03 07:30:00+01', 1),
      ('2020-11-03 02:30:00+01', '2020-11-03 05:30:00+01', 2);
  `);
  console.log(res);

  process.exit();
})();
