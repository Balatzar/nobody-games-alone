const db = require("../../../db");
import { withUser } from "../../../utils/withUser";

const handler = async (req, res) => {
  try {
    const createTeam = await db.query(
      `
      INSERT INTO teams (creator_id, name)
      VALUES
        ($1, $2)
      RETURNING id;
    `,
      [req.currentUser.id, JSON.parse(req.body).name]
    );

    const team = createTeam.rows[0];

    const createUserTeam = await db.query(
      `
      INSERT INTO teams_users (team_id, user_id)
      VALUES
        ($1, $2);
    `,
      [team.id, req.currentUser.id]
    );

    res.status(200).json(team);
  } catch (error) {
    console.warn(error);
    res.status(400).json(error);
  }
};

export default withUser(handler);
