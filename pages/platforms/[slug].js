import Nav from "../../components/nav";
const db = require("../../db");
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Head from "next/head";

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

export async function getServerSideProps(context) {
  const fetchPlatform = await db.query(
    `
    SELECT * FROM platforms
    WHERE slug = $1
  `,
    [context.params.slug]
  );
  const currentPlatform = fetchPlatform.rows[0];

  const fetchGames = await db.query(
    `
    SELECT DISTINCT games.* FROM games
    INNER JOIN games_users_platforms ON games_users_platforms.game_id = games.id
    INNER JOIN users ON users.id = games_users_platforms.user_id
    INNER JOIN platforms ON platforms.id = games_users_platforms.platform_id
    WHERE platforms.id = $1;
  `,
    [currentPlatform.id]
  );
  const fetchTimeslots = await db.query(
    `
    SELECT DISTINCT timeslots.*, users.username FROM timeslots
    INNER JOIN users ON users.id = timeslots.user_id
    INNER JOIN games_users_platforms ON games_users_platforms.user_id = users.id
    INNER JOIN platforms ON platforms.id = games_users_platforms.platform_id
    WHERE platforms.id = $1;
  `,
    [currentPlatform.id]
  );

  const data = {
    props: {
      games: fetchGames.rows,
      timeslots: prepareTimeslots(fetchTimeslots.rows),
      currentPlatform,
    },
  };
  console.log(data.props);
  return data;
}

export default function PlatformsShow({ games, timeslots, currentPlatform }) {
  const usernameColors = timeslots.reduce((acc, { username }) => {
    if (!acc[username]) {
      acc[username] = colors.shift();
    }
    return acc;
  }, {});
  const events = timeslots.map(({ start, end, id, username }) => ({
    start: new Date(start),
    end: new Date(end),
    id,
    title: username,
    username,
  }));
  return (
    <>
      <Head>
        <title>{currentPlatform.name} - Nobody Games Alone</title>
      </Head>
      <Nav title={true} />
      <div className="p-20 bg-gray-200 h-screen overflow-scroll pb-30">
        <h3 className="text-center text-2xl">{currentPlatform.name}</h3>
        <h4 className="underline">
          Les joueurs sur {currentPlatform.abbreviation} jouent a :
        </h4>
        <ul>
          {games.map(({ name, id, platforms }) => {
            return <li key={id}>{name}</li>;
          })}
        </ul>
        <h4 className="underline">Quand :</h4>
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
