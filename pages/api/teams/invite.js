import { withUser } from "../../../utils/withUser";
import sgMail from "@sendgrid/mail";
const db = require("../../../db");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const handler = async (req, res) => {
  try {
    const { emails: to, id } = JSON.parse(req.body);

    const fetchTeam = await db.query(
      `
    SELECT teams.* FROM teams
    WHERE id = $1;
  `,
      [id]
    );
    const currentTeam = fetchTeam.rows[0];

    const msg = {
      to,
      from: "bataprod@gmail.com",
      subject: `Vous avez été invité par ${req.currentUser.username} !`,
      html: `Bonjour !
    
    Vous avez été invité par votre ami(e) ${req.currentUser.username} à rejoindre son équipe ${currentTeam.name} sur le site Nobody Games Alone !
    
    <a href="${process.env.NEXT_PUBLIC_DOMAIN_URL}/users/welcome?invite=${currentTeam.invite_token}">C'est parti !</a>
    `,
    };

    sgMail.sendMultiple(msg);

    res.status(200).json({ ok: true });
  } catch (error) {
    console.warn(error);
    res.status(400).json(error);
  }
};

export default withUser(handler);
