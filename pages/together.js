import Nav from "../components/nav";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Head from "next/head";
import { useEffect, useState } from "react";

const localizer = momentLocalizer(moment);

const colors = ["#14F74D", "#F5AA90", "#09AEE6", "#CC562F", "#B53105"];

export default function Together() {
  const [events, setEvents] = useState([]);
  const [games, setGames] = useState([]);

  const usernameColors = events.reduce((acc, { username }) => {
    if (!acc[username]) {
      acc[username] = colors.shift();
    }
    return acc;
  }, {});

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/pages/together`);
      const data = await res.json();
      const events = data.timeslots.map((ts) => ({
        start: new Date(ts.start_time),
        end: new Date(ts.end_time),
        title: ts.username,
        ...ts,
      }));
      setEvents(events);
      setGames(data.games);
    };
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Jouons ensemble - Nobody Games Alone</title>
      </Head>
      <Nav title={true} />
      <div className="p-20 bg-gray-200 h-screen overflow-scroll pb-30">
        <h3 className="text-center text-2xl">Jouons ensemble</h3>
        <ul>
          {games.map((game) => {
            return (
              <li key={game.id}>
                <span className="font-bold">{game.name}</span> (
                {game.usernames.join(", ")})
              </li>
            );
          })}
        </ul>
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
