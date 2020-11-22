const db = require("../../../db");
import { withUser } from "../../../utils/withUser";

const handler = async (req, res) => {
  try {
    const { id: groupId } = req.query;

    const fetchMessages = await db.query(
      `
      SELECT messages.body, users.username FROM messages
      INNER JOIN users ON users.id = messages.user_id
      WHERE messages.group_id = $1
      ORDER BY messages.created_at ASC
    `,
      [groupId]
    );

    res.status(200).json(fetchMessages.rows);
  } catch (error) {
    console.warn(error);
    res.status(400).json(error);
  }
};

export default withUser(handler);
