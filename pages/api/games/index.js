const db = require("../../../db");
import { withUser } from "../../../utils/withUser";

const handler = async (req, res) => {
  const data = JSON.parse(req.body);
  const games = data
    .map(({ name, id }) => {
      return `('${name.replace("'", "''")}', '${id}')`;
    })
    .join(",");
  const gameNames = data
    .map(({ name }) => `'${name.replace("'", "''")}'`)
    .join(", ");

  try {
    const gamesQuery = `
      WITH new_games AS(
        INSERT INTO games (name, igdb_id)
          VALUES
            ${games}
        ON CONFLICT ON CONSTRAINT games_name_key DO NOTHING
        RETURNING id
      )
      SELECT * from new_games
      UNION
        SELECT id FROM games WHERE name in (${gameNames})
    `;
    const gamesResponse = await db.query(gamesQuery);
    const gameIds = gamesResponse.rows;

    const gameUserQuery = `
        INSERT INTO games_users
        VALUES
          ${gameIds.map(({ id }) => `(${id}, ${req.currentUser.id})`).join(",")}
    `;
    const gameUserResponse = await db.query(gameUserQuery);

    res.statusCode = 200;
    res.end(JSON.stringify(gameIds));
  } catch (error) {
    res.statusCode = 400;
    res.end(JSON.stringify(error));
  }
};

export default withUser(handler);
