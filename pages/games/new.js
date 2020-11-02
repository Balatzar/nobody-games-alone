import Nav from "../../components/nav";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function GamesNew() {
  const [games, setGames] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedGames, setSelectedGames] = useState({});
  const router = useRouter();

  const searchGame = (event) => {
    event.preventDefault();
    fetch(`/api/games/search?q=${query}`)
      .then((res) => res.json())
      .then(({ data }) => {
        setGames(data);
        setSelectedGames({});
      });
  };

  const checkGame = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setSelectedGames({
        ...selectedGames,
        [value]: games.find((game) => game.id == value),
      });
    } else {
      const { [value]: removed, ...remainingMovies } = selectedGames;
      // https://stackoverflow.com/questions/34401098/remove-a-property-in-an-object-immutably
      setSelectedGames(remainingMovies);
    }
  };

  const submitGames = () => {
    const query = {
      method: "POST",
      body: JSON.stringify(Object.values(selectedGames)),
    };

    fetch(`/api/games`, query).then((res) => {
      if (res.status === 200) {
        router.push("/timeslots/new");
      } else {
        res.json().then((error) => console.warn(error));
      }
    });
  };

  return (
    <>
      <Head>
        <title>Ajouter des jeux - Nobody Games Alone</title>
      </Head>
      <Nav title={true} />

      <div className="p-20 bg-gray-200 h-screen overflow-scroll pb-30">
        <h3 className="text-center text-2xl">Sélectionner des jeux</h3>
        <form onSubmit={searchGame}>
          <label>Nom : </label>
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
        </form>
        <form>
          {!!games.length && (
            <div>
              <ul>
                {games.map(({ name, id }, i) => {
                  return (
                    <li key={i}>
                      <label htmlFor="{game}">{name}</label>
                      <input onChange={checkGame} value={id} type="checkbox" />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </form>
      </div>
      <footer className="bg-white justify-center p-4 flex fixed w-full bottom-0 h-32">
        <button
          type="button"
          disabled={!Object.keys(selectedGames).length}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center absolute ${!Object.keys(
            selectedGames
          ).length && "opacity-50 cursor-not-allowed"}`}
          onClick={submitGames}
        >
          Jeux sélectionnés
        </button>
      </footer>
    </>
  );
}
