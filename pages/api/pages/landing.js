const db = require("../../../db");
import { withUser } from "../../../utils/withUser";

const handler = async (req, res) => {
  const currentUser = req.currentUser || null
  const fetchPlatforms = await db.query(`
    SELECT platforms.*, string_agg(DISTINCT(games.name), '||') as games FROM platforms
    INNER JOIN games_users_platforms ON games_users_platforms.platform_id = platforms.id
    INNER JOIN games ON games.id = games_users_platforms.game_id
    GROUP BY platforms.id;
  `);

  res.status(200).json({platforms: fetchPlatforms.rows, currentUser});
};

export default withUser(handler);
