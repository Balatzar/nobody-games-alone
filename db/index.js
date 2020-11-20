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
    const start = Date.now();
    const res = pool.query(text, params);
    console.log(`Query duration: ${Date.now() - start}ms`);
    return res;
  },
};
