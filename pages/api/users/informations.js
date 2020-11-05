import { withUser } from "../../../utils/withUser";

const handler = async (req, res) => {
  res.status(200).json(req.currentUser || {})
}

export default withUser(handler)