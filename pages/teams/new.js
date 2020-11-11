import Nav from "../../components/nav";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function TeamsNew() {
  const [name, setName] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submitTeam = async (event) => {
    event.preventDefault();
    if (!name) return;
    setLoading(true);

    const query = {
      method: "POST",
      body: JSON.stringify({ name }),
    };

    const res = await fetch(`/api/teams`, query);
    const data = await res.json();

    if (res.status === 200) {
      router.push(`/teams/${data.id}/invite`);
    } else {
      setLoading(false);
      console.warn(data);
    }
  };

  return (
    <>
      <Head>
        <title>Créer une équipe - Nobody Games Alone</title>
      </Head>
      <Nav title={true} />

      <div className="p-20 bg-gray-200 h-screen overflow-scroll pb-30">
        <h3 className="text-center text-2xl">Créer une équipe</h3>
        <form onSubmit={submitTeam}>
          <label>Nom de l'équipe</label>
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
              <input
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 px-2 rounded text-center border-l-8"
                type="submit"
                value="Créer"
              />
            </>
          )}
        </form>
      </div>
    </>
  );
}
