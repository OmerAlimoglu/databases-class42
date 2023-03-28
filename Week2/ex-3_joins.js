import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
});

db.connect((err) => {
  if (err) throw err;
  console.log("mysql connected...");
});

db.query("CREATE DATABASE IF NOT EXISTS homework_w2", (err, result) => {
  if (err) throw err;
  console.log("Database created...");
});

db.query("USE homework_w2", (err) => {
  if (err) {
    throw err;
  }
});

db.query(
  `SELECT a.author_name, m.author_name AS mentor_name
    FROM authors a
    LEFT JOIN authors m ON a.mentor = m.author_id;`,
  (err, result) => {
    if (err) throw err;
    console.log("all authors and corresponding mentors selected...");
  }
);

db.query(
  `SELECT a.*, COALESCE(rp.paper_title, 'No Paper') AS paper_title
    FROM authors a
    LEFT JOIN author_paper ap ON a.author_id = ap.author_id
    LEFT JOIN research_papers rp ON ap.paper_id = rp.paper_id;`,
  (err, result) => {
    if (err) throw err;
    console.log("all authors and corresponding papers selected...");
  }
);
