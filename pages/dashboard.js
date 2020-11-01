import Nav from "../components/nav";
const db = require("../db");
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Head from "next/head";

const localizer = momentLocalizer(moment);

export async function getServerSideProps() {
  const fetchGames = await db.query("SELECT name, id FROM games;");
  const fetchTimeslots = await db.query(
    "SELECT start_time, end_time, id from timeslots;"
  );
  console.log(fetchTimeslots.rows);
  const timeslots = fetchTimeslots.rows.map(({ start_time, end_time, id }) => ({
    start: start_time.toString(),
    end: end_time.toString(),
    id,
  }));
  const data = { props: { games: fetchGames.rows, timeslots } };
  console.log(data.props);
  return data;
}

export default function Dashboard({ games, timeslots }) {
  console.log(timeslots);
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
