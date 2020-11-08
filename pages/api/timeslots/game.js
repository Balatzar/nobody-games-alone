const db = require("../../../db");

const handler = async (req, res) => {
  const fetchTimeslots = await db.query(
    `
    SELECT DISTINCT timeslots.*, users.username FROM timeslots
    INNER JOIN users ON users.id = timeslots.user_id
    INNER JOIN games_users_platforms ON games_users_platforms.user_id = timeslots.id
    INNER JOIN games ON games.id = games_users_platforms.game_id
    WHERE games.slug = $1
  `,
    [req.query.slug]
  );

  res.status(200).json(fetchTimeslots.rows);
};

export default handler;
