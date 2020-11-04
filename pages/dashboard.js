import Nav from "../components/nav";
const db = require("../db");
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Head from "next/head";
import { mergeObjects } from "../utils/helpers";

const localizer = momentLocalizer(moment);

const colors = ["#14F74D", "#F5AA90", "#09AEE6", "#CC562F", "#B53105"];

const prepareTimeslots = (timeslots) => {
  return timeslots.map(({ start_time, end_time, id, username }) => ({
    start: start_time.toString(),
    end: end_time.toString(),
    id,
    username: username || null,
  }));
};

// Refactor to use an api route and load the page faster, with loading indicator
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
    SELECT DISTINCT games.*, platforms.abbreviation as platforms FROM games
    INNER JOIN games_users_platforms ON games_users_platforms.game_id = games.id
    INNER JOIN users ON users.id = games_users_platforms.user_id
    INNER JOIN platforms ON platforms.id = games_users_platforms.platform_id
    WHERE users.id = ${currentUser.id};
  `);
  const fetchTimeslots = await db.query(`
    SELECT timeslots.* FROM timeslots
    WHERE user_id = ${currentUser.id};
  `);
  let i = 0;
  const fetchOtherTimeslots = await db.query(
    `
    SELECT timeslots.*, users.username FROM timeslots
    INNER JOIN users on users.id = timeslots.user_id
    WHERE (${fetchTimeslots.rows
      .map(() => `start_time <= $${++i} AND end_time >= $${++i}`)
      .join(" OR ")})
      AND NOT timeslots.id IN (${fetchTimeslots.rows
        .map(({ id }) => id)
        .join(",")});
  `,
    fetchTimeslots.rows.reduce((acc, { start_time, end_time }) => {
      // Warning: start_time is compared to end_time and vice versa.
      // https://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
      acc.push(end_time);
      acc.push(start_time);
      return acc;
    }, [])
  );
  const data = {
    props: {
      games: mergeObjects(fetchGames.rows, "platforms"),
      timeslots: prepareTimeslots(fetchTimeslots.rows),
      currentUser,
      otherTimeslots: prepareTimeslots(fetchOtherTimeslots.rows),
    },
  };
  console.log(data.props);
  return data;
}

export default function Dashboard({ games, timeslots, otherTimeslots }) {
  const usernameColors = otherTimeslots.reduce((acc, { username }) => {
    if (!acc[username]) {
      acc[username] = colors.shift();
    }
    return acc;
  }, {});
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
        username,
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
          {games.map(({ name, id, platforms }) => {
            return (
              <li key={id}>
                {name} ({platforms.join(", ")})
              </li>
            );
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

            if (event.username) {
              newStyle.backgroundColor = usernameColors[event.username];
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
