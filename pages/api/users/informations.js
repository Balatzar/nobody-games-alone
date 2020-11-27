import { withUser } from "../../../utils/withUser";

const handler = async (req, res) => {
  const { name, image, email } = req.currentUser || {};
  res.status(200).json({ name, image, email } || {});
};

export default withUser(handler);
