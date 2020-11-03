import Nav from "../components/nav";
const db = require("../db");
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Head from "next/head";

const localizer = momentLocalizer(moment);

const prepareTimeslots = (timeslots) => {
  return timeslots.map(({ start_time, end_time, id, username }) => ({
    start: start_time.toString(),
    end: end_time.toString(),
    id,
    username: username || null,
  }));
};

export async function getServerSideProps(context) {
  const fetchUser = await db.query(
    `
      SELECT * FROM users
      WHERE temp_token = $1;
    `,
    [context.req.cookies.temp_token]
  );
  const currentUser = fetchUser.rows[0];
  const fetchGames = await db.query(`
    SELECT games.* FROM games
    INNER JOIN games_users ON games_users.game_id = games.id
    INNER JOIN users ON users.id = games_users.user_id
    WHERE users.id = ${currentUser.id};
  `);
  const fetchTimeslots = await db.query(`
    SELECT timeslots.* FROM timeslots
    INNER JOIN timeslots_users ON timeslots_users.timeslot_id = timeslots.id
    INNER JOIN users ON users.id = timeslots_users.user_id
    WHERE users.id = ${currentUser.id};
  `);
  let i = 0;
  const fetchOtherTimeslots = await db.query(
    `
    SELECT timeslots.*, users.username FROM timeslots
    INNER JOIN timeslots_users on timeslots_users.timeslot_id = timeslots.id
    INNER JOIN users on users.id = timeslots_users.user_id
    WHERE (${fetchTimeslots.rows
      .map(() => `start_time >= $${++i} AND end_time <= $${++i}`)
      .join(" OR ")})
      AND NOT timeslots.id IN (${fetchTimeslots.rows
        .map(({ id }) => id)
        .join(",")});
  `,
    fetchTimeslots.rows.reduce((acc, { start_time, end_time }) => {
      acc.push(start_time);
      acc.push(end_time);
      return acc;
    }, [])
  );
  const data = {
    props: {
      games: fetchGames.rows,
      timeslots: prepareTimeslots(fetchTimeslots.rows),
      currentUser,
      otherTimeslots: prepareTimeslots(fetchOtherTimeslots.rows),
    },
  };
  console.log(data.props);
  return data;
}

export default function Dashboard({ games, timeslots, otherTimeslots }) {
  const events = timeslots
    .map(({ start, end, id }) => ({
      start: new Date(start),
      end: new Date(end),
      id,
      title: "Moi",
    }))
    .concat(
      otherTimeslots.map(({ start, end, id, username }) => ({
        start: new Date(start),
        end: new Date(end),
        id,
        title: username,
        isMine: true,
      }))
    );
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
          culture="fr"
          eventPropGetter={(event, start, end, isSelected) => {
            let newStyle = {
              backgroundColor: "lightgrey",
              color: "black",
              borderRadius: "0px",
              border: "none",
            };

            if (event.isMine) {
              newStyle.backgroundColor = "lightblue";
            }

            return {
              className: "",
              style: newStyle,
            };
          }}
        />
      </div>
    </>
  );
}
