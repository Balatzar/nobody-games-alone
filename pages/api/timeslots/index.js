const db = require("../../../db");
import { withUser } from "../../../utils/withUser";

const handler = async (req, res) => {
  const timeslots = JSON.parse(req.body)
    .map(({ start, end }) => {
      return `('${start}', '${end}')`;
    })
    .join(",");

  const query = `
    INSERT INTO timeslots (start_time, end_time)
    VALUES
      ${timeslots}
    RETURNING id;
  `;

  try {
    const createTimeslots = await db.query(query);
    const timeslotIds = createTimeslots.rows.map(({ id }) => id);
    const createUserTimeslots = await db.query(`
      INSERT INTO timeslots_users
      VALUES
        ${timeslotIds.map((id) => `(${id}, ${req.currentUser.id})`).join(",")}
    `);

    res.statusCode = 200;
    res.end(JSON.stringify(createTimeslots.rows));
  } catch (error) {
    res.statusCode = 400;
    res.end(JSON.stringify(error));
  }
};

export default withUser(handler);
