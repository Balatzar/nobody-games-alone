import Nav from "../components/nav";
const db = require("../db");
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Head from "next/head";
import * as cookie from "cookie";

const localizer = momentLocalizer(moment);

export async function getServerSideProps(context) {
  const parsedCookies = cookie.parse(context.req.headers.cookie);
  const fetchUser = await db.query(
    `
      SELECT * FROM users
      WHERE temp_token = $1
    `,
    [parsedCookies.temp_token]
  );
  const currentUser = fetchUser.rows[0];
  const fetchGames = await db.query(`
    SELECT games.* FROM games
    INNER JOIN games_users ON games_users.game_id = games.id
    INNER JOIN users ON users.id = games_users.user_id
    WHERE users.id = ${currentUser.id}
  `);
  const fetchTimeslots = await db.query(
    "SELECT start_time, end_time, id from timeslots;"
  );
  const timeslots = fetchTimeslots.rows.map(({ start_time, end_time, id }) => ({
    start: start_time.toString(),
    end: end_time.toString(),
    id,
  }));
  const data = {
    props: {
      games: fetchGames.rows,
      timeslots,
      currentUser,
    },
  };
  console.log(data.props);
  return data;
}

export default function Dashboard({ games, timeslots }) {
  const events = timeslots.map(({ start, end, id }) => ({
    start: new Date(start),
    end: new Date(end),
    id,
  }));
  return (
    <>
      <Head>
        <title>Dashboard - Nobody Games Alone</title>
      </Head>
      <Nav title={true} />
      <div className="p-20 bg-gray-200 h-screen overflow-scroll pb-30">
        <h3 className="text-center text-2xl">Ma dashboard</h3>
        <h4 className="underline">Mes jeux</h4>
        <ul>
          {games.map(({ name, id }) => {
            return <li key={id}>{name}</li>;
          })}
        </ul>
        <h4 className="underline">Mes disponibilités</h4>
        <Calendar
          selectable
          localizer={localizer}
          events={events}
          defaultView={Views.WEEK}
          defaultDate={new Date()}
        />
      </div>
    </>
  );
}
