const db = require("../../../db");

const handler = async (req, res) => {
  const fetchPlatforms = await db.query(`
    SELECT platforms.*, string_agg(games.name, '||') as games FROM platforms
    INNER JOIN games_users_platforms ON games_users_platforms.platform_id = platforms.id
    INNER JOIN games ON games.id = games_users_platforms.game_id
    GROUP BY platforms.id;
  `);

  res.status(200).json(fetchPlatforms.rows);
};

export default handler;
