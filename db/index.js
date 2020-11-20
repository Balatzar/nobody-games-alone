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
  async query(text, params) {
    console.log(text);
    console.table(params);
    const start = Date.now();
    const res = await pool.query(text, params);
    console.log(`Query duration: ${Date.now() - start}ms`);
    return res;
  },
};
