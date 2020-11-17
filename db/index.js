const { Pool } = require("pg");
const config = process.env.PGUSER
  ? {
      ssl: {
        rejectUnauthorized: false,
      },
    }
  : {};
const pool = new Pool(config);
module.exports = {
  query: (text, params) => {
    console.log(text);
    console.log(params);
    return pool.query(text, params);
  },
};
