const db = require("../../../db");
import { withUser } from "../../../utils/withUser";

const handler = async (req, res) => {
  try {
    const { id: teamId } = req.query;

    const fetchTimeslots = await db.query(
      `
      SELECT timeslots.*, users.username FROM timeslots
      INNER JOIN users ON users.id = timeslots.user_id
      INNER JOIN teams_users ON teams_users.user_id = users.id
      INNER JOIN teams ON teams.id = teams_users.team_id
      WHERE teams.id = $1;
    `,
      [teamId]
    );

    const fetchUsers = await db.query(
      `
      SELECT users.username FROM users
      INNER JOIN teams_users ON teams_users.user_id = users.id
      INNER JOIN teams ON teams.id = teams_users.team_id
      WHERE teams.id = $1;
    `,
      [teamId]
    );

    res.status(200).json({
      timeslots: fetchTimeslots.rows,
      users: fetchUsers.rows,
      currentUser: req.currentUser,
    });
  } catch (error) {
    console.warn(error);
    res.status(400).json(error);
  }
};

export default withUser(handler);
