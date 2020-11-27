import NextAuth from "next-auth";
import Providers from "next-auth/providers";

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
  ],
  database: { ...database, type: "postgres" },
  pages: {
    newUser: "/users/new",
  },
  events: {
    createUser: async (message) => {
      console.log(message);
    },
  },
  callbacks: {
    session: async (session, user, sessionToken) => {
      session.user.id = user.id;
      return Promise.resolve(session);
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
