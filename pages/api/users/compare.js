const db = require("../../../db");
import { mergeObjects } from "../../../utils/helpers";
import { withUser } from "../../../utils/withUser";

const handler = async (req, res) => {
  const { first, second } = req.query;
  const fetchUsers = await db.query(
    `
    SELECT * FROM users
    WHERE users.username IN ($1, $2)
  `,
    [first, second]
  );
  const userIds = fetchUsers.rows.map(({ id }) => id);

  const fetchGames = await db.query(
    `
    SELECT DISTINCT games.*, platforms.abbreviation as platforms, users.username FROM games
    INNER JOIN games_users_platforms ON games_users_platforms.game_id = games.id
    INNER JOIN users ON users.id = games_users_platforms.user_id
    INNER JOIN platforms ON platforms.id = games_users_platforms.platform_id
    WHERE users.id IN ($1, $2);
  `,
    userIds
  );

  const fetchTimeslots = await db.query(
    `
    SELECT timeslots.*, users.username FROM timeslots
    INNER JOIN users on users.id = timeslots.user_id
    WHERE user_id IN ($1, $2);
  `,
    userIds
  );

  const { firstUserGames, secondUserGames } = mergeObjects(
    fetchGames.rows,
    "platforms",
    ["id", "username"]
  ).reduce(
    (acc, game) => {
      if (game.username === first) {
        acc.firstUserGames.push(game);
      } else {
        acc.secondUserGames.push(game);
      }
      return acc;
    },
    { firstUserGames: [], secondUserGames: [] }
  );

  res.status(200).json({
    firstUserGames,
    secondUserGames,
    timeslots: fetchTimeslots.rows,
  });
};

export default withUser(handler);
