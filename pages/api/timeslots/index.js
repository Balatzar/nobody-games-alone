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
    const createTimeslots = await db.query(query);

    res.statusCode = 200;
    res.end(JSON.stringify(createTimeslots.rows));
  } catch (error) {
    console.warn(error);
    res.statusCode = 400;
    res.end(JSON.stringify(error));
  }
};

export default withUser(handler);
