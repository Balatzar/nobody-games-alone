import Nav from "../../components/nav";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { parseCookies, setCookie } from "nookies";

export default function GamesNew() {
  const [games, setGames] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedGames, setSelectedGames] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [steamImportMode, setSteamImportMode] = useState(false);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submitId = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/games/steam?id=${id}`);
    const { games: importedGames } = await res.json();

    setLoading(false);
    setGames(importedGames);
  };

  const triggerSearchGame = async (query) => {
    setLoadingSearch(true);
    const res = await fetch(`/api/games/search?q=${query}`);
    const { data } = await res.json();
    const gameIds = selectedGames.map(({ gameId }) => gameId);
    setGames([...games.filter(({ id }) => gameIds.includes(id)), ...data]);
    setLoadingSearch(false);
  };

  const searchGame = (event) => {
    event.preventDefault();
    if (!query) return;
    triggerSearchGame(query);
  };

  const checkGame = (event, game) => {
    const { checked, value } = event.target;
    const platformId = parseInt(value, 10);
    const findGame = ({ gameId }) => gameId === game.id;
    const currentSelectedGame = selectedGames.find(findGame);
    const currentSelectedGameIndex = selectedGames.findIndex(findGame);

    if (checked) {
      // This is hell
      // Lots of code to make code immutable, look into immutable-js
      // Or move this code to a reducer
      if (currentSelectedGame) {
        setSelectedGames([
          ...selectedGames.slice(0, currentSelectedGameIndex),
          {
            ...currentSelectedGame,
            platforms: [...currentSelectedGame.platforms, platformId],
          },
          ...selectedGames.slice(currentSelectedGameIndex + 1),
        ]);
      } else {
        setSelectedGames([
          ...selectedGames,
          { gameId: game.id, platforms: [platformId] },
        ]);
      }
    } else {
      if (currentSelectedGame.platforms.length === 1) {
        setSelectedGames([
          ...selectedGames.slice(0, currentSelectedGameIndex),
          ...selectedGames.slice(currentSelectedGameIndex + 1),
        ]);
      } else {
        const currentPlatformIndex = currentSelectedGame.platforms.findIndex(
          (id) => id === platformId
        );
        setSelectedGames([
          ...selectedGames.slice(0, currentSelectedGameIndex),
          {
            ...currentSelectedGame,
            platforms: [
              ...currentSelectedGame.platforms.slice(0, currentPlatformIndex),
              ...currentSelectedGame.platforms.slice(currentPlatformIndex + 1),
            ],
          },
          ...selectedGames.slice(currentSelectedGameIndex + 1),
        ]);
      }
    }
  };

  const goToNextPage = () => {
    if (router.query.go_to) {
      router.push(router.query.go_to);
    } else {
      router.push("/timeslots/new");
    }
  };

  const submitGames = async () => {
    setLoadingCreate(true);
    const selectedGameIds = selectedGames.map(({ gameId }) => gameId);

    const query = {
      method: "POST",
      body: JSON.stringify({
        games: games
          .filter(({ id }) => selectedGameIds.includes(id))
          .map((game) => ({
            ...game,
            platforms: game.platforms.filter(({ id }) =>
              selectedGames
                .find(({ gameId }) => gameId === game.id)
                .platforms.includes(id)
            ),
          })),
      }),
    };

    const res = await fetch(`/api/games`, query);
    if (res.status === 200) {
      goToNextPage();
    } else {
      setLoadingCreate(false);
      console.warn(res);
    }
  };

  return (
    <>
      <Head>
        <title>Ajouter des jeux - Nobody Games Alone</title>
      </Head>
      <Nav title={true} />

      <div className="p-20 bg-gray-200 h-screen overflow-scroll pb-30">
        {steamImportMode ? (
          <>
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
              peut vous aider (ouverture dans un nouvel onglet). Votre ID
              devrait ressembler à ça : 76561198076185971.
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
          </>
        ) : (
          <>
            <h3 className="text-center text-2xl">Ajouter des jeux</h3>
            <form onSubmit={searchGame}>
              <label>Nom : </label>
              {loadingSearch ? (
                <span>Chargement...</span>
              ) : (
                <>
                  <input
                    type="text"
                    name="q"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                    }}
                  />
                  <input
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 px-2 rounded text-center border-l-8"
                    type="submit"
                    value="Chercher"
                  />
                </>
              )}
              <a
                className="underline"
                href="https://airtable.com/shrw0s7oTWD2alWxx"
                target="_blank"
              >
                Jeu manquant ?
              </a>{" "}
              <a
                onClick={() => setSteamImportMode(true)}
                className="underline cursor-pointer"
              >
                Import Steam
              </a>
            </form>
          </>
        )}
        <form>
          {!!games.length && (
            <div>
              <ul className="list-disc">
                {games.map((game) => {
                  return (
                    <li key={game.id}>
                      <p htmlFor={game.name}>
                        {game.name} ({Math.ceil(game.playtime_forever / 60)}{" "}
                        heures de jeu)
                      </p>
                      <ul className="pl-6">
                        {game.platforms.map((platform) => {
                          return (
                            <li key={`${game.id}-${platform.id}`}>
                              <label>
                                <input
                                  onChange={(e) => checkGame(e, game)}
                                  value={platform.id}
                                  type="checkbox"
                                  checked={platform.selected}
                                />{" "}
                                {platform.abbreviation}
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </form>
      </div>
      <footer className="bg-white justify-center p-4 flex fixed w-full bottom-0 h-32">
        {loadingCreate ? (
          <span>Chargement...</span>
        ) : (
          <>
            <button
              type="button"
              disabled={!selectedGames.length}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center absolute ${
                !selectedGames.length && "opacity-50 cursor-not-allowed"
              }`}
              onClick={submitGames}
            >
              Jeux sélectionnés
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
    </>
  );
}
