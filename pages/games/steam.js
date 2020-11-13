import { setCookie } from "nookies";
import Head from "next/head";
import Nav from "../../components/nav";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function GamesSteam() {
  const [id, setId] = useState("");
  const [count, setCount] = useState(0);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGames, setSelectedGames] = useState({});
  const router = useRouter();

  const submitId = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/games/steam?id=${id}`);
    const { count, games } = await res.json();
    setLoading(false);
    setCount(count);
    setGames(games);
  };

  const selectGame = ({ target: { checked, value } }) => {
    if (checked) {
      setSelectedGames((selectedGames) => {
        return { ...selectedGames, [value]: true };
      });
    } else {
      setSelectedGames((selectedGames) => {
        const { [value]: _, ...newSelectedGames } = selectedGames;
        return newSelectedGames;
      });
    }
  };

  const submitGames = (e) => {
    e.preventDefault();
    setCookie(
      null,
      "games",
      JSON.stringify(
        Object.keys(selectedGames).map((game) => ({
          value: game,
          imported: false,
        }))
      ),
      {
        maxAge: 10 * 365 * 24 * 60 * 60, // 10 years
        path: "/",
        sameSite: "strict",
      }
    );
    router.push(`/games/new`);
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
            <p>
              Après selectionné des jeux vous devrez utiliser la fonction de
              recherche de notre site pour les synchroniser (on voudrait pas
              ajouter n'importe quoi !)
            </p>
            {games.map((game) => {
              return (
                <p key={game.appid}>
                  <label>
                    {game.name} ({(game.playtime_forever / 60).toFixed(2)}{" "}
                    heures de jeu)
                    <input
                      value={game.name}
                      type="checkbox"
                      onChange={selectGame}
                    />
                  </label>
                </p>
              );
            })}
          </>
        ) : null}
      </div>
      <footer className="bg-white justify-center p-4 flex fixed w-full bottom-0 h-32">
        <button
          type="button"
          disabled={!Object.keys(selectedGames).length}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center absolute ${
            !Object.keys(selectedGames).length &&
            "opacity-50 cursor-not-allowed"
          }`}
          onClick={submitGames}
        >
          Jeux sélectionnés
        </button>
      </footer>
    </>
  );
}
