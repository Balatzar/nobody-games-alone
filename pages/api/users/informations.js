import { withUser } from "../../../utils/withUser";

const handler = async (req, res) => {
  const { username, image, email } = req.currentUser || {};
  res.status(200).json({ username, image, email } || {});
};

export default withUser(handler);
