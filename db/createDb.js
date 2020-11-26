const db = require("../db");
const moment = require("moment");

(async function () {
  const today = moment().format("YYYY-MM-DD");
  const res = await db.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    DROP TABLE IF EXISTS games_users_platforms;
    DROP TABLE IF EXISTS teams_users;
    DROP TABLE IF EXISTS groups_users;
    DROP TABLE IF EXISTS games;
    DROP TABLE IF EXISTS timeslots;
    DROP TABLE IF EXISTS messages;
    DROP TABLE IF EXISTS teams;
    DROP TABLE IF EXISTS groups;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS accounts;
    DROP TABLE IF EXISTS sessions;
    DROP TABLE IF EXISTS verification_requests;
    DROP TABLE IF EXISTS platforms;
    
    CREATE TABLE accounts (
      id SERIAL,
      compound_id VARCHAR(255) NOT NULL,
      user_id INTEGER NOT NULL,
      provider_type VARCHAR(255) NOT NULL,
      provider_id VARCHAR(255) NOT NULL,
      provider_account_id VARCHAR(255) NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      access_token_expires TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );
    
    CREATE TABLE sessions (
      id SERIAL,
      user_id INTEGER NOT NULL,
      expires TIMESTAMPTZ NOT NULL,
      session_token VARCHAR(255) NOT NULL,
      access_token VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );
    
    CREATE TABLE users (
      id SERIAL,
      name VARCHAR(255),
      email VARCHAR(255),
      email_verified TIMESTAMPTZ,
      image VARCHAR(255),
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      temp_token uuid DEFAULT uuid_generate_v4(),
      PRIMARY KEY (id)
    );
    CREATE INDEX idx_user_temp_token ON users(temp_token);
    
    CREATE TABLE verification_requests (
      id SERIAL,
      identifier VARCHAR(255) NOT NULL,
      token VARCHAR(255) NOT NULL,
      expires TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );
    
    CREATE UNIQUE INDEX compound_id ON accounts(compound_id);
    
    CREATE INDEX provider_account_id ON accounts(provider_account_id);
    
    CREATE INDEX provider_id ON accounts(provider_id);
    
    CREATE INDEX user_id ON accounts(user_id);
    
    CREATE UNIQUE INDEX session_token ON sessions(session_token);
    
    CREATE UNIQUE INDEX access_token ON sessions(access_token);
    
    CREATE UNIQUE INDEX email ON users(email);
    
    CREATE UNIQUE INDEX token ON verification_requests(token);
    
    CREATE TABLE games (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      name VARCHAR NOT NULL UNIQUE,
      slug VARCHAR NOT NULL UNIQUE,
      igdb_id INT NOT NULL UNIQUE,
      cover_image_id VARCHAR NOT NULL UNIQUE,
      cover_width INT,
      cover_height INT,
      storyline VARCHAR,
      summary VARCHAR,
      first_release_date DATE
    );
    
    CREATE TABLE platforms (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      name VARCHAR NOT NULL UNIQUE,
      igdb_id INT NOT NULL UNIQUE,
      slug VARCHAR NOT NULL UNIQUE,
      abbreviation VARCHAR,
      category INT
    );
    
    CREATE TABLE games_users_platforms (
      game_id INT,
      user_id INT,
      platform_id INT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT fk_game FOREIGN KEY(game_id) REFERENCES games(id),
      CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id),
      CONSTRAINT fk_platform FOREIGN KEY(platform_id) REFERENCES platforms(id)
    );
    
    CREATE TABLE timeslots (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      start_time TIMESTAMPTZ NOT NULL,
      end_time TIMESTAMPTZ NOT NULL,
      user_id INT,
      CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
    );
    
    CREATE TABLE teams (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      name VARCHAR NOT NULL UNIQUE,
      creator_id INT NOT NULL,
      invite_token uuid DEFAULT uuid_generate_v4(),
      CONSTRAINT fk_user FOREIGN KEY(creator_id) REFERENCES users(id)
    );
    
    CREATE TABLE teams_users (
      team_id INT NOT NULL,
      user_id INT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT fk_team FOREIGN KEY(team_id) REFERENCES teams(id),
      CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
    );
    
    CREATE TABLE groups (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    
    CREATE TABLE groups_users (
      group_id INT NOT NULL,
      user_id INT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT fk_group FOREIGN KEY(group_id) REFERENCES groups(id),
      CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
    );
    
    CREATE TABLE messages (
      body VARCHAR NOT NULL,
      user_id INT,
      team_id INT,
      group_id INT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id),
      CONSTRAINT fk_team FOREIGN KEY(team_id) REFERENCES teams(id),
      CONSTRAINT fk_group FOREIGN KEY(group_id) REFERENCES groups(id)
    );
    
  `);
  console.log(res);

  process.exit();
})();
