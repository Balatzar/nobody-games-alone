const active = "bg-teal-600 text-white";

export default function GameImport({ games }) {
  const currentGame = games.find(({ imported }) => !imported);
  const currentGameIndex = games.findIndex(({ imported }) => !imported);

  const navSize = games.length < 4 ? games.length : 4;

  const selectedGames = games.slice(
    currentGameIndex,
    currentGameIndex + navSize
  );

  return (
    <div className="flex flex-col items-center my-12">
      <p className="text-center">
        {games.filter(({ imported }) => imported).length + 1}/{games.length}
      </p>
      <div className="flex text-gray-700">
        <div className="flex h-12 font-medium rounded-full bg-gray-200">
          {selectedGames.map((game) => {
            return (
              <div
                style={{ border: "1px solid #718096" }}
                key={game.value}
                className={`w-30 md:flex justify-center items-center hidden  leading-5 transition duration-150 ease-in rounded-full text-center m-1 p-3 ${
                  game.value === currentGame.value && active
                }`}
              >
                {game.value}
              </div>
            );
          })}
          <div className="md:hidden flex justify-center items-center leading-5 transition duration-150 ease-in rounded-full text-center p-5">
            ...
          </div>
          <div
            className={`md:hidden flex justify-center items-center leading-5 transition duration-150 ease-in rounded-full text-center p-5 ${active}`}
            style={{ width: "200px" }}
          >
            {currentGame.value}
          </div>
          <div className="md:hidden flex justify-center items-center leading-5 transition duration-150 ease-in rounded-full text-center p-5">
            ...
          </div>
        </div>
      </div>
    </div>
  );
}
