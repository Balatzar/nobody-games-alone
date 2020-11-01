const db = require("../db");

db.query("SELECT NOW()", (err, res) => {
  console.log(err, res);
  db.end();
});
