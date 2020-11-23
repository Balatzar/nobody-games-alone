import Layout from "../components/layout";
import Nav from "../components/nav";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Head from "next/head";
import useSWR from "swr";
import Link from "next/link";
import { prepareTimeslots } from "../utils/helpers";
import { useRouter } from "next/router";

const localizer = momentLocalizer(moment);

const colors = ["#14F74D", "#F5AA90", "#09AEE6", "#CC562F", "#B53105"];

export default function Dashboard() {
  const router = useRouter();
  const { data, error } = useSWR(`/api/pages/dashboard`);
  if (error) {
    console.warn(error);
  }
  const games = data ? data.games : [];
  const timeslots = data ? data.timeslots : [];
  const otherTimeslots = data ? data.otherTimeslots : [];
  const teams = data ? data.teams : [];

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
    <Layout>
      <Head>
        <title>Dashboard - Nobody Games Alone</title>
      </Head>
      <Nav title={true} />
      <div className="p-20 bg-gray-200 h-screen overflow-scroll pb-30">
        <h3 className="text-center text-2xl">Ma dashboard</h3>
        {data ? (
          <>
            <div className="flex">
              <div className="w-2/4">
                <h4 className="underline">Mes jeux</h4>
                <Link
                  href={{
                    pathname: `/games/new`,
                    query: { go_to: "/dashboard" },
                  }}
                >
                  <a>Ajouter un jeu</a>
                </Link>
                <ul>
                  {games.map(({ name, id, platforms, slug }) => {
                    return (
                      <Link key={id} href={`/games/${slug}`}>
                        <li className="underline cursor-pointer">
                          <a>
                            {name} ({platforms.join(", ")})
                          </a>
                        </li>
                      </Link>
                    );
                  })}
                </ul>
              </div>
              <div className="w-2/4">
                <h4 className="underline text-right">Mes équipes</h4>
                <Link
                  href={{
                    pathname: `/teams/new`,
                  }}
                >
                  <a className="text-right block">Créer une équipe</a>
                </Link>
                <ul className="text-right underline">
                  {teams.map(({ name, id }) => {
                    return (
                      <li key={id}>
                        <Link href={`/teams/${id}`}>
                          <a>{name}</a>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  href={{
                    pathname: `/users/migrate`,
                  }}
                >
                  <a className="text-right block underline">
                    Migrer mon compte
                  </a>
                </Link>
              </div>
            </div>
            <h4 className="underline mt-5">Mes disponibilités</h4>
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
              onSelectEvent={({ username }) => {
                if (!username) return;
                router.push(
                  `/users/compare/${data.currentUser.username}/${username}`
                );
              }}
            />
          </>
        ) : (
          <p>Chargement...</p>
        )}
      </div>
    </Layout>
  );
}
