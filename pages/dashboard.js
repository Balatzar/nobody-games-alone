import Nav from "../components/nav";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Head from "next/head";
import useSWR from "swr";
import Link from "next/link";
import { prepareTimeslots } from "../utils/helpers";

const localizer = momentLocalizer(moment);

const colors = ["#14F74D", "#F5AA90", "#09AEE6", "#CC562F", "#B53105"];

export default function Dashboard() {
  const { data, error } = useSWR(`/api/pages/dashboard`);
  if (error) {
    console.warn(error);
  }
  const games = data ? data.games : [];
  const timeslots = data ? data.timeslots : [];
  const otherTimeslots = data ? data.otherTimeslots : [];
  const usernameColors = otherTimeslots.reduce((acc, { username }) => {
    if (!acc[username]) {
      acc[username] = colors.shift();
    }
    return acc;
  }, {});
  const events = prepareTimeslots(timeslots, "Moi").concat(
    prepareTimeslots(otherTimeslots, "", true)
  );
  return (
    <>
      <Head>
        <title>Dashboard - Nobody Games Alone</title>
      </Head>
      <Nav title={true} />
      <div className="p-20 bg-gray-200 h-screen overflow-scroll pb-30">
        <h3 className="text-center text-2xl">Ma dashboard</h3>
        {data ? (
          <>
            <h4 className="underline">Mes jeux</h4>
            <Link
              href={{ pathname: `/games/new`, query: { go_to: "/dashboard" } }}
            >
              <a>Ajouter un jeu</a>
            </Link>
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
            <Link
              href={{
                pathname: `/timeslots/new`,
                query: { go_to: "/dashboard" },
              }}
            >
              <a>Ajouter des disponibilités</a>
            </Link>
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
          </>
        ) : (
          <p>Chargement...</p>
        )}
      </div>
    </>
  );
}
