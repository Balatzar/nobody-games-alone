const db = require("../../../db");

const mergeObjects = (objects, key) => {
  return Object.values(
    objects.reduce((acc, object) => {
      if (acc[object.id]) {
        acc[object.id][key].push(object[key]);
      } else {
        acc[object.id] = {
          ...object,
          [key]: [object[key]],
        };
      }
      return acc;
    }, {})
  );
};

const handler = async (req, res) => {
  const fetchTimeslots = await db.query(
    `
    SELECT timeslots.*, users.username FROM timeslots
    INNER JOIN users on users.id = timeslots.user_id
    `
  );
  const fetchGames = await db.query(
    `
    SELECT games.*, users.username as usernames FROM games
    INNER JOIN games_users on games_users.game_id = games.id
    INNER JOIN users on users.id = games_users.user_id
    `
  );

  res.status(200).json({
    timeslots: fetchTimeslots.rows,
    games: mergeObjects(fetchGames.rows, "usernames"),
  });
};

export default handler;
