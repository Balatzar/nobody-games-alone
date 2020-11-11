const db = require("../../../db");

export default async function index(req, res) {
  const { username, invite } = JSON.parse(req.body);
  try {
    const response = await db.query(
      `
      INSERT INTO users (username)
      VALUES
        ($1)
      RETURNING temp_token, username, id;
    `,
      [username]
    );

    const user = response.rows[0];

    if (invite) {
      const joinTeam = await db.query(
        `
        INSERT INTO teams_users (team_id, user_id)
        VALUES ((SELECT teams.id FROM teams
          WHERE teams.invite_token = $1), $2)
      `,
        [invite, user.id]
      );
    }

    res.status(200).json(user);
  } catch (error) {
    console.warn(error);
    res.status(400).json(error);
  }
}
