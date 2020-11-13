import Nav from "../../components/nav";
import GameImport from "../../components/gameImport";
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
  const [importedGames, setImportedGames] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const { games } = parseCookies(document.cookie);
    if (!games) return;
    const parsedGames = JSON.parse(games);
    setImportedGames(parsedGames);
    const query = parsedGames.find(({ imported }) => !imported).value;
    setQuery(query);
    triggerSearchGame(query);
  }, []);

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
      const currentImportedGameIndex = importedGames.findIndex(
        ({ imported }) => !imported
      );
      if (
        importedGames.length &&
        importedGames.length != currentImportedGameIndex + 1
      ) {
        importedGames[
          importedGames.findIndex(({ imported }) => !imported)
        ].imported = true;

        setCookie(null, "games", JSON.stringify(importedGames), {
          maxAge: 10 * 365 * 24 * 60 * 60, // 10 years
          path: "/",
          sameSite: "strict",
        });
        location.reload();
        return;
      }
      setCookie(null, "games", "", {
        maxAge: -999999999, // delete cookie
        path: "/",
        sameSite: "strict",
      });
      if (router.query.go_to) {
        router.push(router.query.go_to);
      } else {
        router.push("/timeslots/new");
      }
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
        {importedGames.length ? (
          <div style={{ marginTop: "-100px" }}>
            <GameImport games={importedGames} />
          </div>
        ) : null}
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
          {importedGames.length ? null : (
            <Link href={`/games/steam`}>
              <a className="underline">Import Steam</a>
            </Link>
          )}
        </form>
        <form>
          {!!games.length && (
            <div>
              <ul className="list-disc">
                {games.map((game) => {
                  return (
                    <li key={game.id}>
                      <p htmlFor={game.name}>{game.name}</p>
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
        )}
      </footer>
    </>
  );
}
