const db = require("../../../db");
import { withUser } from "../../../utils/withUser";
import { mergeComplexObjects } from "../../../utils/helpers";

const handler = async (req, res) => {
  const fetchPlatforms = await db.query(`
    SELECT platforms.*, games.slug as g_slug, games.id as g_id, games.name as g_name FROM platforms
    INNER JOIN games_users_platforms ON games_users_platforms.platform_id = platforms.id
    INNER JOIN games ON games.id = games_users_platforms.game_id;
  `);

  const fetchGames = await db.query(`
    SELECT games.* from games
    LIMIT 10;
  `);

  res.status(200).json({
    platforms: mergeComplexObjects(fetchPlatforms.rows, "g_", "games"),
    games: fetchGames.rows,
    currentUser: req.currentUser,
  });
};

export default withUser(handler);
