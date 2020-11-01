const db = require("../../../db");

export default async function create(req, res) {
  const games = JSON.parse(req.body).reduce((acc, { name, id }) => {
    acc += `('${name}', '${id}')`;
    return acc;
  }, "");

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
