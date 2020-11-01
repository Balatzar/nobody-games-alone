const db = require("../../../db");

export default async function index(req, res) {
  console.log(req.body);
  const query = `
    INSERT INTO users (username)
    VALUES
      ('${JSON.parse(req.body).username}')
    RETURNING temp_token, username;
  `;
  try {
    const response = await db.query(query);

    res.statusCode = 200;
    res.end(JSON.stringify(response.rows));
  } catch (error) {
    res.statusCode = 400;
    res.end(JSON.stringify(error));
  }
}
