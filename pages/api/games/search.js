export default async function search(req, res) {
  try {
    const url = process.env.IGDB_URL;
    const headers = new Headers({
      "Client-ID": process.env.IGDB_CLIENT_ID,
      Authorization: process.env.IGDB_TOKEN,
    });
    const query = {
      method: "POST",
      headers,
      body: `
      fields *, platforms.*, cover.*;
      where name ~ *"${req.query.q}"* & platforms != null;
      limit 50;
      sort first_release_date desc;
    `,
    };

    const response = await fetch(url, query);
    const data = await response.json();

    res.status(200).json({ data });
  } catch (error) {
    console.warn(error);
    res.status(400).json(error);
  }
}
