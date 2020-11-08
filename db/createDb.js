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

    INSERT INTO games (name, igdb_id, slug, cover_image_id, storyline, summary, first_release_date, cover_width, cover_height)
      VALUES
      ('The Witcher: Monster Slayer', 137125, 'the-witcher-monster-slayer', 'co2ffz', '', 'The Witcher: Monster Slayer is a location-based augmented-reality RPG that challenges you to become a professional monster hunter. Venture out into the world around you and use your mobile device to track witcher-world monsters that roam close-by. Track these monsters and prepare for combat using time of day, weather conditions, and your witcher knowledge to gain an advantage on your quest to becoming an elite monster slayer.', null, 659, 878),
      ('The Witcher 3: Wild Hunt', 1942, 'the-witcher-3-wild-hunt', 'co1wyy', 'The Witcher 3: Wild Hunt concludes the story of the witcher Geralt of Rivia, the series'' protagonist, whose story to date has been covered in the previous installments. Geralt''s new mission comes in dark times as the mysterious and otherworldly army known as the Wild Hunt invades the Northern Kingdoms, leaving only blood soaked earth and fiery ruin in its wake; and it seems the Witcher is the key to stopping their cataclysmic rampage.', 'RPG and sequel to The Witcher 2 (2011), The Witcher 3 follows witcher Geralt of Rivia as he seeks out his former lover and his young subject while intermingling with the political workings of the wartorn Northern Kingdoms. Geralt has to fight monsters and deal with people of all sorts in order to solve complex problems and settle contentious disputes, each ranging from the personal to the world-changing.', '2015-05-19', 1170, 1559),
      ('Sid Meier''s Civilization: Beyond Earth', 6038, 'sid-meiers-civilization-beyond-earth', 'co1sr0', '', 'Sid Meier''s Civilization: Beyond Earth is a new science-fiction-themed entry into the award-winning Civilization series. Set in the future, global events have destabilized the world leading to a collapse of modern society, a new world order and an uncertain future for humanity. As the human race struggles to recover, the re-developed nations focus their resources on deep space travel to chart a new beginning for mankind. \n \nAs part of an expedition sent to find a home beyond Earth, you will write the next chapter for humanity as you lead your people into a new frontier and create a new civilization in space. Explore and colonize an alien planet, research new technologies, amass mighty armies, build incredible Wonders and shape the face of your new world. As you embark on your journey you must make critical decisions. From your choice of sponsor and the make-up of your colony, to the ultimate path you choose for your civilization, every decision opens up new possibilities.', '2014-10-24', 600, 800);
    
    INSERT INTO platforms (name, igdb_id, abbreviation, category, slug)
      VALUES
      ('Xbox One', 49, 'XONE', 1, 'xboxone'),
      ('PC (Microsoft Windows)', 6, 'PC', 4, 'win'),
      ('Linux', 3, 'Linux', 4, 'linux'),
      ('iOS', 39, 'iOS', 4, 'ios');
    
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
