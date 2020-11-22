import Layout from "../../components/layout";
import Nav from "../../components/nav";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import useSWR from "swr";
import { prepareTimeslots } from "../../utils/helpers";

const localizer = momentLocalizer(moment);

const ids = {};
let currentId = 0;

const deleteMsg = "Cliquer pour supprimer";

export default function TimeslotsNew() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { error, isValidating } = useSWR(`/api/timeslots/mine`, {
    onSuccess(data) {
      data.forEach((t) => (ids[t.id] = true));
      setEvents(prepareTimeslots(data, deleteMsg));
    },
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  if (error) {
    console.warn(error);
  }

  const clickEvent = (event) => {
    if (confirm("Voulez-vous supprimer cette disponibilité ?")) {
      const eventToDeleteIndex = events.findIndex((e) => e.id === event.id);
      setEvents([
        ...events.slice(0, eventToDeleteIndex),
        ...events.slice(eventToDeleteIndex + 1),
      ]);
    }
  };

  const goToNextPage = () => {
    if (router.query.go_to) {
      router.push(router.query.go_to);
    } else {
      router.push("/dashboard");
    }
  };

  const submitEvents = async () => {
    setLoading(true);
    const query = {
      method: "POST",
      body: JSON.stringify(events),
    };

    const res = await fetch(`/api/timeslots`, query);
    if (res.status === 200) {
      goToNextPage();
    } else {
      setLoading(false);
      const error = await res.json();
      console.warn(error);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Ajouter des disponibilités - Nobody Games Alone</title>
      </Head>
      <Nav title={true} />

      <div className="p-20 bg-gray-200 h-screen overflow-scroll pb-30">
        <h3 className="text-center text-2xl">
          Sélectionner des disponibilités pour jouer
        </h3>
        {isValidating ? (
          <p>Chargement...</p>
        ) : (
          <Calendar
            selectable
            localizer={localizer}
            events={events}
            defaultView={Views.WEEK}
            defaultDate={new Date()}
            onSelectEvent={clickEvent}
            onSelectSlot={(event) => {
              let id = ++currentId;
              while (ids[id]) {
                id = ++currentId;
              }
              setEvents([...events, { ...event, id, title: deleteMsg }]);
            }}
            culture="fr"
          />
        )}
      </div>

      <footer className="bg-white justify-center p-4 flex fixed w-full bottom-0 h-32">
        {loading ? (
          <span>Chargement...</span>
        ) : (
          <>
            <button
              type="button"
              disabled={!events.length}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center absolute ${
                !events.length && "opacity-50 cursor-not-allowed"
              }`}
              onClick={submitEvents}
            >
              Disponibilités sélectionnés
            </button>
            <a
              onClick={(e) => {
                e.preventDefault();
                goToNextPage();
              }}
              className="underline cursor-pointer"
              style={{ marginTop: "50px" }}
            >
              Passer
            </a>
          </>
        )}
      </footer>
    </Layout>
  );
}
