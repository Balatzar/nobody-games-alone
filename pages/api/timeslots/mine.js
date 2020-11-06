const db = require("../../../db");
import { withUser } from "../../../utils/withUser";

const handler = async (req, res) => {
  const fetchTimeslots = await db.query(
    `
    SELECT timeslots.* FROM timeslots
    WHERE user_id = $1
    `,
    [req.currentUser.id]
  );

  res.status(200).json(fetchTimeslots.rows);
};

export default withUser(handler);
