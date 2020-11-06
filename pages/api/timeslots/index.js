const db = require("../../../db");
import { withUser } from "../../../utils/withUser";

const handler = async (req, res) => {
  const timeslots = JSON.parse(req.body)
    .map(({ start, end }) => {
      return `('${start}', '${end}', ${req.currentUser.id})`;
    })
    .join(",");

  const query = `
    INSERT INTO timeslots (start_time, end_time, user_id)
    VALUES
      ${timeslots}
    RETURNING id;
  `;

  try {
    const destroyTimeslots = await db.query(
      `
      DELETE FROM timeslots
      WHERE user_id = $1
    `,
      [req.currentUser.id]
    );
    const createTimeslots = await db.query(query);

    res.status(200).json(createTimeslots.rows);
  } catch (error) {
    console.warn(error);
    res.status(400).json(error);
  }
};

export default withUser(handler);
