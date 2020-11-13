import { setCookie } from "nookies";
import Head from "next/head";
import Nav from "../../components/nav";
import { useEffect, useState } from "react";

export default function GamesSteam() {
  const [id, setId] = useState("");
  const [count, setCount] = useState(0);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);

  const submitId = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/games/steam?id=${id}`);
    const { count, games } = await res.json();
    setLoading(false);
    setCount(count);
    setGames(games);
  };

  return (
    <>
      <Head>
        <title>Import Steam - Nobody Games Alone</title>
      </Head>
      <Nav title={true} />

      <div className="p-20 bg-gray-200 h-screen overflow-scroll pb-30">
        <h3 className="text-center text-2xl">Import Steam</h3>
        <p>
          Veuillez récupérer votre ID steam en chiffre.{" "}
          <a
            className="underline"
            href="https://steamidfinder.com/"
            target="_blank"
          >
            Ce site
          </a>{" "}
          peut vous aider (ouverture dans un nouvel onglet). Votre ID devrait
          ressembler à ça : 76561198076185971.
        </p>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <form onSubmit={submitId}>
            <label>Votre ID :</label>
            <input value={id} onChange={(e) => setId(e.target.value)} />
            <br />
            <button className="btn-blue" type="submit">
              Importer
            </button>
          </form>
        )}
        {count ? (
          <>
            <p>
              {count} jeux trouvés. Veuillez sélectionner ceux auxquels vous
              jouez régulierement.
            </p>
            {games.map((game) => {
              return (
                <p key={game.appid}>
                  {game.name} ({(game.playtime_forever / 60).toFixed(2)} heures
                  de jeu)
                </p>
              );
            })}
          </>
        ) : null}
      </div>
    </>
  );
}
