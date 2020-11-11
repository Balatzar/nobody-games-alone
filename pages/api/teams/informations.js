const db = require("../../../db");

const handler = async (req, res) => {
  try {
    const fetchTeam = await db.query(
      `
      SELECT teams.*, users.username FROM teams
      INNER JOIN users ON users.id = teams.creator_id
      WHERE invite_token = $1;
    `,
      [req.query.invite]
    );

    res.status(200).json(fetchTeam.rows[0]);
  } catch (error) {
    console.warn(error);
    res.status(400).json(error);
  }
};

export default handler;
