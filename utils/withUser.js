const db = require("../db");
const withUser = (handler) => async (req, res) => {
  const { temp_token } = req.cookies;
  if (temp_token) {
    const response = await db.query(
      `
        SELECT * FROM users
        WHERE temp_token = $1
      `,
      [temp_token]
    );
    const user = response.rows[0];
    req.currentUser = user;
  }
  return handler(req, res);
};

export { withUser };
