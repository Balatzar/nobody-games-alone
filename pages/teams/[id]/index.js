import Nav from "../../../components/nav";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Head from "next/head";
import useSWR from "swr";
import Link from "next/link";
import { prepareTimeslots } from "../../../utils/helpers";
import { useRouter } from "next/router";
const db = require("../../../db");

const localizer = momentLocalizer(moment);

const colors = ["#14F74D", "#F5AA90", "#09AEE6", "#CC562F", "#B53105"];

export async function getServerSideProps(context) {
  const fetchTeam = await db.query(
    `
    SELECT * FROM teams
    WHERE teams.id = $1;
  `,
    [context.params.id]
  );
  console.log(fetchTeam.rows);

  return {
    props: {
      currentTeam: fetchTeam.rows[0],
    },
  };
}

export default function TeamsShow({ currentTeam }) {
  const router = useRouter();
  const { data, error } = useSWR(`/api/teams/show?id=${currentTeam.id}`);
  if (error) {
    console.warn(error);
  }
  console.log(data);

  const users = data ? data.users : [];
  const timeslots = data ? data.timeslots : [];
  const currentUser = data ? data.currentUser : null;

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
        <title>{currentTeam.name} - Nobody Games Alone</title>
      </Head>
      <Nav title={true} />
      <div className="p-20 bg-gray-200 h-screen overflow-scroll pb-30">
        <h3 className="text-center text-2xl">{currentTeam.name}</h3>
        {data ? (
          <>
            <ul>
              {users.map(({ username }) => {
                return <li key={username}>{username}</li>;
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
              onSelectEvent={({ username }) => {
                if (!username) return;
                if (data.currentUser.username === username) return;
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
    </>
  );
}
