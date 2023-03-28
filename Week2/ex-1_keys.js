import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "homework_w2",
});

db.connect((err) => {
  if (err) throw err;
  console.log("mysql connected...");
});

db.query(`CREATE DATABASE IF NOT EXISTS homework_w2`, (err, result) => {
  if (err) throw err;
  console.log("Database created...");
});

db.query("USE homework_w2", (err) => {
  if (err) {
    throw err;
  }
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
        ADD COLUMN  mentor INT,
        ADD CONSTRAINT fk_mentor
        FOREIGN KEY (mentor) REFERENCES authors(author_id)`,
  (err, result) => {
    if (err) throw err;
    console.log("a new column added to the authors table...");
  }
);

db.query(
  `INSERT INTO authors (author_name, university, h_index, mentor) VALUES 
    ('Alice', 'University A', 10, NULL),
    ('Bob', 'University A', 15, 1),
    ('Charlie', 'University A', 8, 2),
    ('Dave', 'University B', 20, NULL),
    ('Eve', 'University B', 12, 4),
    ('Frank', 'University B', 6, 5),
    ('Grace', 'University C', 18, NULL),
    ('Hannah', 'University C', 9, 7),
    ('Isaac', 'University C', 5, 8),
    ('Jane', 'University D', 11, NULL),
    ('Kate', 'University D', 14, 10),
    ('Larry', 'University D', 7, 11),
    ('Mary', 'University E', 16, NULL),
    ('Nick', 'University E', 13, 13),
    ('Oliver', 'University E', 4, 14)`,
  (err, result) => {
    if (err) throw err;
    console.log("authors data inserted...");
  }
);

db.end();
