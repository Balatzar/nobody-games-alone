const db = require("../db");

(async function() {
  const res = await db.query(`
    DROP TABLE IF EXISTS games;
    CREATE TABLE games (
      id SERIAL PRIMARY KEY,
      name VARCHAR NOT NULL UNIQUE,
      igdb_id VARCHAR NOT NULL UNIQUE
    );
  `);
  console.log(res);
})();
