const db = require("../db");
import { getSession } from "next-auth/client";

const withUser = (handler) => async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    req.currentUser = session.user;
  }
  return handler(req, res);
};

export { withUser };
