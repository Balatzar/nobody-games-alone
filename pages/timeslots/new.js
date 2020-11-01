import Nav from "../../components/nav";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);
let id = 0;

export default function TimeslotsNew() {
  const [events, setEvents] = useState([]);

  const clickEvent = (event) => {
    if (confirm("Voulez-vous supprimer cette disponibilité ?")) {
      const eventToDeleteIndex = events.findIndex((e) => e.id === event.id);
      setEvents([
        ...events.slice(0, eventToDeleteIndex),
        ...events.slice(eventToDeleteIndex + 1),
      ]);
    }
  };

  return (
    <>
      <Nav title={true} />

      <div className="p-20 bg-gray-200 h-screen overflow-scroll pb-30">
        <h3 className="text-center text-2xl">
          Sélectionner des disponibilités pour jouer
        </h3>
        <Calendar
          selectable
          localizer={localizer}
          events={events}
          defaultView={Views.WEEK}
          defaultDate={new Date()}
          onSelectEvent={clickEvent}
          onSelectSlot={(event) =>
            setEvents([...events, { ...event, id: ++id }])
          }
        />
      </div>

      <footer className="bg-white justify-center p-4 flex fixed w-full bottom-0 h-32">
        <button
          type="button"
          disabled={!Object.keys([]).length}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center absolute ${!Object.keys(
            []
          ).length && "opacity-50 cursor-not-allowed"}`}
          onClick={() => {}}
        >
          Disponibilités sélectionnés
        </button>
      </footer>
    </>
  );
}
