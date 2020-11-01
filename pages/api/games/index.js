import { Client } from "@8base/api-client";

export default async function create(req, res) {
  const client = new Client(process.env.EIGHT_BASE_URL);

  client.setIdToken(process.env.EIGHT_BASE_TOKEN);

  const games = JSON.parse(req.body).reduce((acc, { name, id }) => {
    acc += `{name: "${name}", igdb_id: ${id}}`;
    return acc;
  }, "");
  const query = `
  mutation {
    gameCreateMany(data: [${games}]) {
      items {
        name
      }
    }
  }
`;

  try {
    const response = await client.request(query);

    res.statusCode = 200;
    res.end(JSON.stringify(response));
  } catch (error) {
    res.statusCode = 400;
    res.end(JSON.stringify(error));
  }
}
