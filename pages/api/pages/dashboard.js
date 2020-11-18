const db = require("../../../db");
import { mergeObjects } from "../../../utils/helpers";
import { withUser } from "../../../utils/withUser";

const handler = async (req, res) => {
  try {
    const { currentUser } = req;

    const fetchGames = await db.query(`
      SELECT DISTINCT games.*, platforms.abbreviation as platforms FROM games
      INNER JOIN games_users_platforms ON games_users_platforms.game_id = games.id
      INNER JOIN users ON users.id = games_users_platforms.user_id
      INNER JOIN platforms ON platforms.id = games_users_platforms.platform_id
      WHERE users.id = ${currentUser.id};
    `);
    const fetchTimeslots = await db.query(`
      SELECT timeslots.* FROM timeslots
      WHERE user_id = ${currentUser.id};
    `);

    let i = 0;
    const fetchOtherTimeslots = fetchTimeslots.rows.length
      ? await db.query(
          `
      SELECT timeslots.*, users.username FROM timeslots
      INNER JOIN users ON users.id = timeslots.user_id
      WHERE (${fetchTimeslots.rows
        .map(() => `start_time <= $${++i} AND end_time >= $${++i}`)
        .join(" OR ")})
        AND NOT timeslots.id IN (${fetchTimeslots.rows
          .map(({ id }) => id)
          .join(",")});
    `,
          fetchTimeslots.rows.reduce((acc, { start_time, end_time }) => {
            // Warning: start_time is compared to end_time and vice versa.
            // https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
            acc.push(end_time);
            acc.push(start_time);
            return acc;
          }, [])
        )
      : { rows: [] };

    const fetchTeams = await db.query(
      `
      SELECT name, id FROM teams
      INNER JOIN teams_users ON teams_users.team_id = teams.id
      WHERE teams_users.user_id = $1
    `,
      [req.currentUser.id]
    );

    res.status(200).json({
      games: mergeObjects(fetchGames.rows, "platforms"),
      timeslots: fetchTimeslots.rows,
      currentUser,
      otherTimeslots: fetchOtherTimeslots.rows,
      teams: fetchTeams.rows,
    });
  } catch (error) {
    console.warn(error);
    res.status(400).json(error);
  }
};

export default withUser(handler);
