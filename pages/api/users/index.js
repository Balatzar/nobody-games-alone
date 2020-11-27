const db = require("../../../db");
import { withUser } from "../../../utils/withUser";

const handler = async (req, res) => {
  const { username, invite } = JSON.parse(req.body);
  try {
    const response = await db.query(
      `
      UPDATE users 
      SET username = $1
      WHERE id = $2
      RETURNING id;
    `,
      [username, req.currentUser.id]
    );

    const user = response.rows[0];

    if (invite) {
      const joinTeam = await db.query(
        `
        INSERT INTO teams_users (team_id, user_id)
        VALUES ((SELECT teams.id FROM teams
          WHERE teams.invite_token = $1), $2);
      `,
        [invite, user.id]
      );
    }

    res.status(200).json(user);
  } catch (error) {
    console.warn(error);
    res.status(400).json(error);
  }
};

export default withUser(handler);
