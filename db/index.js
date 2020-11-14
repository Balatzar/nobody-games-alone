const { Pool } = require("pg");
const pool = new Pool({
  ssl: {
    rejectUnauthorized: false,
  },
});
module.exports = {
  query: (text, params) => {
    console.log(text);
    console.log(params);
    return pool.query(text, params);
  },
};
