const db = require("../db");
import { getSession } from "next-auth/client";

const withUser = (handler) => async (req, res) => {
  const { temp_token } = req.cookies;
  const session = await getSession({ req });

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
  } else if (session) {
    req.currentUser = session.user;
  }
  return handler(req, res);
};

export { withUser };
