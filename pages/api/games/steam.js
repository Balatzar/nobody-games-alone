export default async function search(req, res) {
  try {
    const response = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${process.env.STEAM_KEY}&steamid=${req.query.id}&format=json&include_appinfo=1&include_played_free_games=1`
    );
    const {
      response: { game_count, games },
    } = await response.json();

    res.status(200).json({
      count: game_count,
      games: games.sort((a, b) => b.playtime_forever - a.playtime_forever),
    });
  } catch (error) {
    console.warn(error);
    res.status(400).json({ error: "Steam API request failed" });
  }
}
