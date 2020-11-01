export default async function search(req, res) {
  const url = process.env.IGDB_URL;
  const headers = new Headers({
    "Client-ID": process.env.IGDB_CLIENT_ID,
    Authorization: process.env.IGDB_TOKEN,
  });
  const query = {
    method: "POST",
    headers,
    body: `fields name; where name ~ *"${req.query.q}"*; limit 50;`,
  };

  const response = await fetch(url, query);
  const data = await response.json();

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ data }));
}
