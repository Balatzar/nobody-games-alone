import Nav from "../../components/nav";
const db = require("../../db");
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Head from "next/head";
import Link from "next/link";
import { prepareTimeslots } from "../../utils/helpers";
import useSWR from "swr";

const localizer = momentLocalizer(moment);

const colors = ["#14F74D", "#F5AA90", "#09AEE6", "#CC562F", "#B53105"];

export async function getServerSideProps(context) {
  const fetchPlatform = await db.query(
    `
    SELECT id, name, slug, abbreviation, category FROM platforms
    WHERE slug = $1
  `,
    [context.params.slug]
  );
  const currentPlatform = fetchPlatform.rows[0];

  const fetchGames = await db.query(
    `
    SELECT DISTINCT games.id, games.name, games.slug FROM games
    INNER JOIN games_users_platforms ON games_users_platforms.game_id = games.id
    INNER JOIN platforms ON platforms.id = games_users_platforms.platform_id
    WHERE platforms.id = $1;
  `,
    [currentPlatform.id]
  );

  const data = {
    props: {
      games: fetchGames.rows,
      currentPlatform,
    },
  };
  console.log(data.props);
  return data;
}

export default function PlatformsShow({ games, currentPlatform }) {
  const { data, error } = useSWR(
    `/api/timeslots/platform?slug=${currentPlatform.slug}`
  );
  if (error) {
    console.warn(error);
  }
  const events = data ? prepareTimeslots(data, "", true) : [];

  const usernameColors = events.reduce((acc, { username }) => {
    if (!acc[username]) {
      acc[username] = colors.shift();
    }
    return acc;
  }, {});
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
          {games.map(({ name, id, slug }) => {
            return (
              <Link key={id} href={`/games/${slug}`}>
                <li className="underline cursor-pointer">
                  <a>{name}</a>
                </li>
              </Link>
            );
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
