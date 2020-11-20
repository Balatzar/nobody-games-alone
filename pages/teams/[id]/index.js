import Nav from "../../../components/nav";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Head from "next/head";
import useSWR, { mutate } from "swr";
import Link from "next/link";
import { prepareTimeslots } from "../../../utils/helpers";
import { useRouter } from "next/router";
const db = require("../../../db");
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

const colors = ["#14F74D", "#F5AA90", "#09AEE6", "#CC562F", "#B53105"];

export async function getServerSideProps(context) {
  const fetchTeam = await db.query(
    `
    SELECT name, id, creator_id FROM teams
    WHERE teams.id = $1;
  `,
    [context.params.id]
  );

  return {
    props: {
      currentTeam: fetchTeam.rows[0],
    },
  };
}

export default function TeamsShow({ currentTeam }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { data, error } = useSWR(`/api/teams/show?id=${currentTeam.id}`, {
    refreshInterval: 5000,
  });
  if (error) {
    console.warn(error);
  }

  const users = data ? data.users : [];
  const timeslots = data ? data.timeslots : [];
  const currentUser = data ? data.currentUser : null;
  const messages = data ? data.messages : null;

  const usernameColors = timeslots.reduce((acc, { username }) => {
    if (!acc[username]) {
      acc[username] = colors.shift();
    }
    return acc;
  }, {});

  const events = prepareTimeslots(timeslots, "", true);

  const saveMessage = async (e) => {
    e.preventDefault();
    if (!message) return;
    setLoading(true);

    const query = {
      method: "POST",
      body: JSON.stringify({ message, teamId: currentTeam.id }),
    };

    const res = await fetch(`/api/messages`, query);
    const data = await res.json();

    setLoading(false);

    if (res.status === 200) {
      setMessage("");
      mutate(`/api/teams/show?id=${currentTeam.id}`);
    } else {
      console.warn(data);
    }
  };

  return (
    <>
      <Head>
        <title>{currentTeam.name} - Nobody Games Alone</title>
      </Head>
      <Nav title={true} />
      <div className="p-20 bg-gray-200 h-screen overflow-scroll pb-30">
        <h3 className="text-center text-2xl">{currentTeam.name}</h3>
        <Tabs>
          <TabList>
            <Tab>Informations</Tab>
            <Tab>Tchat</Tab>
          </TabList>
          <TabPanel>
            {data ? (
              <>
                {currentTeam.creator_id === currentUser.id ? (
                  <Link href={`/teams/${currentTeam.id}/invite`}>
                    <a className="underline">Inviter</a>
                  </Link>
                ) : null}
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
                    if (currentUser.username === username) return;
                    router.push(
                      `/users/compare/${currentUser.username}/${username}`
                    );
                  }}
                />
              </>
            ) : (
              <p>Chargement...</p>
            )}
          </TabPanel>
          <TabPanel>
            {data ? (
              <>
                <div className="flex">
                  <div className="w-1/6">
                    <ul>
                      {users.map(({ username }) => {
                        return <li key={username}>{username}</li>;
                      })}
                    </ul>
                  </div>
                  <div className="w-5/6">
                    <ul>
                      {messages.map((message) => {
                        return (
                          <li>
                            <b>{message.username} : </b>
                            {message.body}
                          </li>
                        );
                      })}
                    </ul>
                    <form onSubmit={saveMessage}>
                      {loading ? (
                        <p>Chargement...</p>
                      ) : (
                        <>
                          <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
                            type="submit"
                          >
                            Envoyer
                          </button>
                        </>
                      )}
                    </form>
                  </div>
                </div>
              </>
            ) : (
              <p>Chargement...</p>
            )}
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}
