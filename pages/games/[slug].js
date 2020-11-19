import Nav from "../../components/nav";
const db = require("../../db");
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { prepareTimeslots } from "../../utils/helpers";
import useSWR from "swr";

const localizer = momentLocalizer(moment);

const colors = ["#14F74D", "#F5AA90", "#09AEE6", "#CC562F", "#B53105"];

export async function getServerSideProps(context) {
  const fetchGame = await db.query(
    `
    SELECT name, id, slug, cover_image_id, cover_width, cover_height, summary, storyline FROM games
    WHERE slug = $1
  `,
    [context.params.slug]
  );
  const currentGame = fetchGame.rows[0];

  const fetchPlatforms = await db.query(
    `
    SELECT DISTINCT platforms.id, platforms.name, platforms.slug FROM platforms
    INNER JOIN games_users_platforms ON games_users_platforms.platform_id = platforms.id
    INNER JOIN games ON games.id = games_users_platforms.game_id
    WHERE games.id = $1;
  `,
    [currentGame.id]
  );

  const data = {
    props: {
      platforms: fetchPlatforms.rows,
      currentGame,
    },
  };
  return data;
}

export default function GamesShow({ platforms, currentGame }) {
  const { data, error } = useSWR(
    `/api/timeslots/game?slug=${currentGame.slug}`
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
        <title>{currentGame.name} - Nobody Games Alone</title>
        <meta name="description" content={currentGame.summary} />
        <meta property="og:title" content={currentGame.name} key="ogtitle" />
        <meta
          property="og:description"
          content={currentGame.summary}
          key="ogdesc"
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_DOMAIN_URL}/games/${currentGame.slug}`}
          key="ogurl"
        />
        <meta
          property="og:image"
          content={
            currentGame.cover_image_id &&
            `https://images.igdb.com/igdb/image/upload/t_1080p/${currentGame.cover_image_id}.jpg`
          }
          key="ogimage"
        />
        <meta
          property="og:site_name"
          content="Nobody Games Alone"
          key="ogsitename"
        />
      </Head>
      <Nav title={true} />
      <div className="p-20 bg-gray-200 h-screen overflow-scroll pb-30">
        <h3 className="text-center text-2xl">{currentGame.name}</h3>
        {currentGame.summary ? (
          <>
            <p>Présentation</p>
            <p>{currentGame.summary}</p>
          </>
        ) : null}
        {currentGame.storyline ? (
          <>
            <p>Résumé</p>
            <p>{currentGame.storyline}</p>
          </>
        ) : null}
        {currentGame.cover_image_id ? (
          <Image
            src={`https://images.igdb.com/igdb/image/upload/t_1080p/${currentGame.cover_image_id}.jpg`}
            width={currentGame.cover_width}
            height={currentGame.cover_height}
          />
        ) : null}
        <h4 className="underline">
          Les joueurs jouent à {currentGame.name} sur :
        </h4>
        <ul>
          {platforms.map(({ name, id, slug }) => {
            return (
              <Link key={id} href={`/platforms/${slug}`}>
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
