const db = require("../../../db");
import { withUser } from "../../../utils/withUser";

const handler = async (req, res) => {
  try {
    const { message, teamId } = JSON.parse(req.body);

    const createTeam = await db.query(
      `
      INSERT INTO messages (body, user_id, team_id)
      VALUES
        ($1, $2, $3)
      RETURNING body;
    `,
      [message, req.currentUser.id, teamId]
    );

    const createdMessage = createTeam.rows[0];

    res.status(200).json(createdMessage);
  } catch (error) {
    console.warn(error);
    res.status(400).json(error);
  }
};

export default withUser(handler);
