const db = require("../../../db");

export default async function index(req, res) {
  const timeslots = JSON.parse(req.body)
    .map(({ start, end }) => {
      return `('${start}', '${end}')`;
    })
    .join(",");

  const query = `
    INSERT INTO timeslots (start_time, end_time)
    VALUES
      ${timeslots};
  `;

  try {
    const response = await db.query(query);

    res.statusCode = 200;
    res.end(JSON.stringify(response.rows));
  } catch (error) {
    res.statusCode = 400;
    res.end(JSON.stringify(error));
  }
}
