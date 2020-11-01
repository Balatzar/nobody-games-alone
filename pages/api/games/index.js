const db = require("../../../db");

export default async function index(req, res) {
  const games = JSON.parse(req.body)
    .map(({ name, id }) => {
      return `('${name.replace("'", "''")}', '${id}')`;
    })
    .join(",");

  const query = `
    INSERT INTO games (name, igdb_id)
    VALUES
      ${games}
    ON CONFLICT ON CONSTRAINT games_name_key
    DO NOTHING;
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
