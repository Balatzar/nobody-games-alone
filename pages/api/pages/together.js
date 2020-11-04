const db = require("../../../db");
import { mergeObjects } from "../../../utils/helpers";

const handler = async (req, res) => {
  const fetchTimeslots = await db.query(
    `
    SELECT timeslots.*, users.username FROM timeslots
    INNER JOIN users on users.id = timeslots.user_id
    `
  );
  const fetchGames = await db.query(
    `
    SELECT DISTINCT games.*, users.username as usernames FROM games
    INNER JOIN games_users_platforms ON games_users_platforms.game_id = games.id
    INNER JOIN users ON users.id = games_users_platforms.user_id
    `
  );

  res.status(200).json({
    timeslots: fetchTimeslots.rows,
    games: mergeObjects(fetchGames.rows, "usernames"),
  });
};

export default handler;
