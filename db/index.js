const { Pool } = require("pg");
const pool = new Pool();
module.exports = {
  query: (text, params) => {
    console.log(text);
    return pool.query(text, params);
  },
};
