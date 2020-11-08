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
    const gamesData = games
      .map(
        ({ name, id, slug, cover, storyline, summary, first_release_date }) => {
          return `('${name.replace("'", "''")}', ${id}, '${slug}', '${
            cover ? cover.image_id : ""
          }', '${storyline ? storyline.replace("'", "''") : ""}', '${
            summary ? summary.replace("'", "''") : ""
          }', ${
            first_release_date
              ? moment.unix(first_release_date).format("YYYY/MM/DD")
              : null
          }, ${cover ? cover.width : "null"}, ${
            cover ? cover.height : "null"
          })`;
        }
      )
      .join(",");
    const gameNames = games
      .map(({ name }) => `'${name.replace("'", "''")}'`)
      .join(", ");

    const gamesQuery = `
      WITH new_games AS(
        INSERT INTO games (name, igdb_id, slug, cover_image_id, storyline, summary, first_release_date, cover_width, cover_height)
          VALUES
            ${gamesData}
        ON CONFLICT ON CONSTRAINT games_name_key DO NOTHING
        RETURNING id, igdb_id
      )
      SELECT * from new_games
      UNION
        SELECT id, igdb_id FROM games WHERE name in (${gameNames});
    `;
    const gamesResponse = await db.query(gamesQuery);
    const gameDbData = gamesResponse.rows;

    const platformsData = platformsToCreate
      .map(({ name, id, abbreviation, category, slug }) => {
        return `('${name.replace("'", "''")}', ${id}, '${abbreviation.replace(
          "'",
          "''"
        )}', ${category}, '${slug}')`;
      })
      .join(",");
    const platformNames = platformsToCreate
      .map(({ name }) => `'${name.replace("'", "''")}'`)
      .join(", ");

    const platformsQuery = `
      WITH new_platforms AS(
        INSERT INTO platforms (name, igdb_id, abbreviation, category, slug)
          VALUES
            ${platformsData}
        ON CONFLICT ON CONSTRAINT platforms_name_key DO NOTHING
        RETURNING id, igdb_id
      )
      SELECT * from new_platforms
      UNION
        SELECT id, igdb_id FROM platforms WHERE name in (${platformNames});
    `;
    const platformsResponse = await db.query(platformsQuery);
    const platformsDbData = platformsResponse.rows;

    const joinTableData = games.reduce((acc, game) => {
      game.platforms.forEach((platform) => {
        // From view `id` is `igdb_id`
        const platformDbId = platformsDbData.find(
          ({ igdb_id }) => igdb_id == platform.id
        ).id;
        const gameDbId = gameDbData.find(({ igdb_id }) => igdb_id == game.id)
          .id;
        acc.push(`(${gameDbId}, ${req.currentUser.id}, ${platformDbId})`);
      });
      return acc;
    }, []);
    console.log(joinTableData);

    const gameUserQuery = `
        INSERT INTO games_users_platforms (game_id, user_id, platform_id)
        VALUES
          ${joinTableData.join(",")};
    `;
    const gameUserResponse = await db.query(gameUserQuery);

    res.status(200).json(JSON.stringify({ message: "All objects created" }));
  } catch (error) {
    console.warn(error);
    res.status(400).json(JSON.stringify(error));
  }
};

export default withUser(handler);
