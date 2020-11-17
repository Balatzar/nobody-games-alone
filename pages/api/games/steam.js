export default async function search(req, res) {
  try {
    const fetchSteamGames = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_KEY}&steamid=${req.query.id}&format=json&include_appinfo=1&include_played_free_games=1`
    );
    const {
      response: { games },
    } = await fetchSteamGames.json();

    const gamesDict = games.reduce((acc, game) => {
      const url = `https://store.steampowered.com/app/${game.appid}`;
      acc[url] = game;
      return acc;
    }, []);

    const headers = new Headers({
      "Client-ID": process.env.IGDB_CLIENT_ID,
      Authorization: process.env.IGDB_TOKEN,
    });

    let idgbData = [];
    let i = 0;
    while (i < Math.ceil(games.length / 100)) {
      const query = {
        method: "POST",
        headers,
        body: `
          fields category, checksum, game.*, url, game.platforms.*, game.cover.*;
          limit 100;
          where url = (${games
            .slice(i * 100, (i + 1) * 100)
            .map(({ appid }) => `"https://store.steampowered.com/app/${appid}"`)
            .join(",")}) & game != null & game.platforms != null;
        `,
      };

      i += 1;

      const fetchIgdbGames = await fetch(
        "https://api.igdb.com/v4/websites",
        query
      );
      const data = await fetchIgdbGames.json();
      idgbData = idgbData.concat(data);
    }

    console.log(idgbData.length);

    res.status(200).json({
      games: idgbData
        .map((website) => {
          return {
            ...website.game,
            playtime_forever: gamesDict[website.url].playtime_forever,
          };
        })
        .sort((a, b) => b.playtime_forever - a.playtime_forever),
    });
  } catch (error) {
    console.warn(error);
    res.status(400).json({ error: "Steam API request failed" });
  }
}
