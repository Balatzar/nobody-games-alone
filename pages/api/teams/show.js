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

    const fetchMessages = await db.query(
      `
      SELECT messages.body, users.username FROM messages
      INNER JOIN users ON users.id = messages.user_id
      WHERE messages.team_id = $1
      ORDER BY messages.created_at ASC
    `,
      [teamId]
    );

    res.status(200).json({
      timeslots: fetchTimeslots.rows,
      users: fetchUsers.rows,
      currentUser: req.currentUser,
      messages: fetchMessages.rows,
    });
  } catch (error) {
    console.warn(error);
    res.status(400).json(error);
  }
};

export default withUser(handler);
