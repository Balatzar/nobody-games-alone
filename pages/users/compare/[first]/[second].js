import Nav from "../../../../components/nav";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Head from "next/head";
import useSWR from "swr";
import Link from "next/link";
import { prepareTimeslots } from "../../../../utils/helpers";
import { useRouter } from "next/router";

const localizer = momentLocalizer(moment);

const colors = ["#14F74D", "#F5AA90", "#09AEE6", "#CC562F", "#B53105"];

export default function Dashboard() {
  const { first, second } = useRouter().query;
  const { data, error } = useSWR(
    `/api/users/compare?first=${first}&second=${second}`
  );
  if (error) {
    console.warn(error);
  }
  const firstUserGames = data ? data.firstUserGames : [];
  const secondUserGames = data ? data.secondUserGames : [];
  const timeslots = data ? data.timeslots : [];

  const usernameColors = timeslots.reduce((acc, { username }) => {
    if (!acc[username]) {
      acc[username] = colors.shift();
    }
    return acc;
  }, {});

  const events = prepareTimeslots(timeslots, "", true);

  return (
    <>
      <Head>
        <title>Dashboard - Nobody Games Alone</title>
      </Head>
      <Nav title={true} />
      <div className="p-20 bg-gray-200 h-screen overflow-scroll pb-30">
        <h3 className="text-center text-2xl">
          {first} VS {second}
        </h3>
        {data ? (
          <div className="flex">
            <div className="w-1/4">
              <h4 className="underline">Mes jeux</h4>
              <ul>
                {firstUserGames.map(({ name, id, platforms, slug }) => {
                  return (
                    <Link key={id} href={`/games/${slug}`}>
                      <li className="underline cursor-pointer">
                        {name} ({platforms.join(", ")})
                      </li>
                    </Link>
                  );
                })}
              </ul>
            </div>
            <div className="w-2/4">
              <h4 className="underline">Nos disponibilités</h4>
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
            <div className="w-1/4">
              <h4 className="underline">Ses jeux</h4>
              <ul>
                {secondUserGames.map(({ name, id, platforms, slug }) => {
                  return (
                    <Link key={id} href={`/games/${slug}`}>
                      <li className="underline cursor-pointer">
                        {name} ({platforms.join(", ")})
                      </li>
                    </Link>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : (
          <p>Chargement...</p>
        )}
      </div>
    </>
  );
}
