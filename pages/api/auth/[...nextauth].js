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
    // Passwordless / email sign in
    Providers.Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  // Optional SQL or MongoDB database to persist users
  database: { ...database, type: "postgres" },
};

export default (req, res) => NextAuth(req, res, options);
