const db = require("../../../db");
import { withUser } from "../../../utils/withUser";

const handler = async (req, res) => {
  const data = JSON.parse(req.body);

  try {
    const destroyTimeslots = await db.query(
      `
      DELETE FROM timeslots
      WHERE user_id = $1
    `,
      [req.currentUser.id]
    );

    let i = 0;
    const createTimeslots = await db.query(
      `
      INSERT INTO timeslots (start_time, end_time, user_id)
      VALUES
        ${data.map(() => `($${++i}, $${++i}, $${++i})`).join()}
      RETURNING id;
    `,
      data.reduce((acc, { start, end }) => {
        acc.push(start);
        acc.push(end);
        acc.push(req.currentUser.id);
        return acc;
      }, [])
    );

    res.status(200).json(createTimeslots.rows);
  } catch (error) {
    console.warn(error);
    res.status(400).json(error);
  }
};

export default withUser(handler);
