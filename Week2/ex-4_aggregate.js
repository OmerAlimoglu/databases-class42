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
  `SELECT rp.paper_title, COUNT(ap.author_id) AS num_authors
    FROM research_papers rp
    LEFT JOIN author_paper ap ON rp.paper_id = ap.paper_id
    GROUP BY rp.paper_id;`,
  (err, result) => {
    if (err) throw err;
    console.log(result);
  }
);

db.query(
  `SELECT COUNT(DISTINCT ap.paper_id) AS num_papers
    FROM author_paper ap
    JOIN authors a ON a.author_id = ap.author_id
    WHERE a.gender = 'F';`,
  (err, result) => {
    if (err) throw err;
    console.log(result);
  }
);

db.query(
  `SELECT university, AVG(a.h_index) AS avg_h_index
    FROM authors a    
    GROUP BY university;`,
  (err, result) => {
    if (err) throw err;
    console.log(result);
  }
);

db.query(
  `SELECT a.university, SUM(DISTINCT ap.paper_id) AS num_papers
    FROM authors a    
    JOIN author_paper ap ON a.author_id = ap.author_id
    GROUP BY a.university;`,
  (err, result) => {
    if (err) throw err;
    console.log(result);
  }
);

db.query(
  `SELECT university, MIN(a.h_index) AS min_h_index, MAX(a.h_index) AS max_h_index
    FROM authors a    
    GROUP BY university`,
  (err, result) => {
    if (err) throw err;
    console.log(result);
  }
);
