const db = require("../../../db");
import { withUser } from "../../../utils/withUser";
import moment from "moment";

const handler = async (req, res) => {
  const { games } = JSON.parse(req.body);

  const platformsToCreate = games.reduce(
    (acc, { platforms }) => {
      platforms.forEach((platform) => {
        if (acc.ids[platform.id]) return;
        acc.data.push(platform);
        acc.ids[platform.id] = true;
      });
      return acc;
    },
    { data: [], ids: {} }
  ).data;

  try {
    let i = 0;
    const gamesQuery = `
      WITH new_games AS(
        INSERT INTO games (name, igdb_id, slug, cover_image_id, storyline, summary, first_release_date, cover_width, cover_height)
          VALUES
            ${games
              .map(
                () =>
                  `($${++i}, $${++i}, $${++i}, $${++i}, $${++i}, $${++i}, $${++i}, $${++i}, $${++i})`
              )
              .join()}
        ON CONFLICT ON CONSTRAINT games_name_key DO NOTHING
        RETURNING id, igdb_id
      )
      SELECT * from new_games
      UNION
        SELECT id, igdb_id FROM games WHERE name in (${games
          .map(() => `$${++i}`)
          .join()});
    `;
    const gamesResponse = await db.query(
      gamesQuery,
      games
        .reduce(
          (
            acc,
            { name, id, slug, cover, storyline, summary, first_release_date }
          ) => {
            acc.push(name);
            acc.push(id);
            acc.push(slug);
            acc.push(cover.image_id);
            acc.push(storyline);
            acc.push(summary);
            acc.push(moment.unix(first_release_date).format("YYYY/MM/DD"));
            acc.push(cover.width);
            acc.push(cover.height);
            return acc;
          },
          []
        )
        .concat(games.map(({ name }) => name))
    );
    const gameDbData = gamesResponse.rows;

    i = 0;
    const platformsQuery = `
      WITH new_platforms AS(
        INSERT INTO platforms (name, igdb_id, abbreviation, category, slug)
          VALUES
            ${platformsToCreate
              .map(() => `($${++i}, $${++i}, $${++i}, $${++i}, $${++i})`)
              .join()}
        ON CONFLICT ON CONSTRAINT platforms_name_key DO NOTHING
        RETURNING id, igdb_id
      )
      SELECT * from new_platforms
      UNION
        SELECT id, igdb_id FROM platforms WHERE name in (${platformsToCreate
          .map(() => `$${++i}`)
          .join()});
    `;
    const platformsResponse = await db.query(
      platformsQuery,
      platformsToCreate
        .reduce((acc, { name, id, abbreviation, category, slug }) => {
          acc.push(name);
          acc.push(id);
          acc.push(abbreviation);
          acc.push(category);
          acc.push(slug);
          return acc;
        }, [])
        .concat(platformsToCreate.map(({ name }) => name))
    );
    const platformsDbData = platformsResponse.rows;

    const joinTableData = games.reduce((acc, game) => {
      game.platforms.forEach((platform) => {
        // From view `id` is `igdb_id`
        const platformDbId = platformsDbData.find(
          ({ igdb_id }) => igdb_id == platform.id
        ).id;
        const gameDbId = gameDbData.find(({ igdb_id }) => igdb_id == game.id)
          .id;
        acc.push({
          gameId: gameDbId,
          userId: req.currentUser.id,
          platformId: platformDbId,
        });
      });
      return acc;
    }, []);

    i = 0;
    const gameUserQuery = `
        INSERT INTO games_users_platforms (game_id, user_id, platform_id)
        VALUES
          ${joinTableData.map(() => `($${++i}, $${++i}, $${++i})`).join()};
    `;
    const gameUserResponse = await db.query(
      gameUserQuery,
      joinTableData.reduce((acc, { gameId, userId, platformId }) => {
        acc.push(gameId);
        acc.push(userId);
        acc.push(platformId);
        return acc;
      }, [])
    );

    res.status(200).json(JSON.stringify({ message: "All objects created" }));
  } catch (error) {
    console.warn(error);
    res.status(400).json(JSON.stringify(error));
  }
};

export default withUser(handler);
