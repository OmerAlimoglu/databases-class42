import mysql from "mysql";

const database = mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
});

database.connect((err) => {
  if (err) throw err;
  console.log("mysql connected...");
});

database.query("CREATE DATABASE IF NOT EXISTS homework_w2", (err, result) => {
  if (err) throw err;
  console.log("Database created...");
});

const db = mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "homework_w2",
});

db.query(
  `CREATE TABLE IF NOT EXISTS authors (
    author_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(255) NOT NULL,
    university VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    h_index INT,
    gender ENUM('male', 'female', 'other')
  )`,
  (err, result) => {
    if (err) throw err;
    console.log("authors table created...");
  }
);

db.query(
  `ALTER TABLE authors
  ADD COLUMN mentor INT,
  ADD CONSTRAINT fk_mentor
  FOREIGN KEY (mentor) REFERENCES authors(author_id)`,
  (err, result) => {
    if (err) throw err;
    console.log("a new column added to the authors table...");
  }
);
