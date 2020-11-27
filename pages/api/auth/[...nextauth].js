import NextAuth from "next-auth";
import Providers from "next-auth/providers";
const db = require("../../../db");

const database = process.env.PGHOST
  ? {
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    }
  : {
      host: "127.0.0.1",
      port: 5432,
      username: "balthazar",
      password: "",
      database: "balthazar",
    };

const options = {
  providers: [
    // Passwordless
    Providers.Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    Providers.Twitch({
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
    }),
    Providers.Spotify({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
  ],
  database: { ...database, type: "postgres" },
  pages: {
    newUser: "/users/new",
  },
  callbacks: {
    session: async (session, user, sessionToken) => {
      session.user.id = user.id;
      const fetchUser = await db.query(
        `
        SELECT * FROM users
        WHERE id = $1;
      `,
        [user.id]
      );

      session.user.username = fetchUser.rows[0].username;
      return Promise.resolve(session);
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
