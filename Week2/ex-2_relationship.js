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
  `CREATE TABLE IF NOT EXISTS research_Papers (
        paper_id INT NOT NULL AUTO_INCREMENT,
        paper_title VARCHAR(255) NOT NULL,
        conference VARCHAR(255) NOT NULL,
        publish_date DATE NOT NULL,
        PRIMARY KEY (paper_id)
      )`,
  (err, result) => {
    if (err) throw err;
    console.log("research_Papers table created...");
  }
);

db.query(
  `CREATE TABLE IF NOT EXISTS author_paper (
        id INT AUTO_INCREMENT PRIMARY KEY
        author_id INT NOT NULL,
        paper_id INT NOT NULL,
        FOREIGN KEY (author_id) REFERENCES authors (author_id),
        FOREIGN KEY (paper_id) REFERENCES research_Papers (paper_id)
      )`,
  (err, result) => {
    if (err) throw err;
    console.log("author_paper table created...");
  }
);

db.query(
  `INSERT INTO research_papers   (paper_title, conference, publish_date) VALUES 
    ('Paper 1', 'Conference A', '2022-01-01'),
('Paper 2', 'Conference A', '2022-02-01'),
('Paper 3', 'Conference A', '2022-03-01'),
('Paper 4', 'Conference A', '2022-04-01'),
('Paper 5', 'Conference A', '2022-05-01'),
('Paper 6', 'Conference B', '2022-06-01'),
('Paper 7', 'Conference B', '2022-07-01'),
('Paper 8', 'Conference B', '2022-08-01'),
('Paper 9', 'Conference B', '2022-09-01'),
('Paper 10', 'Conference B', '2022-10-01'),
('Paper 11', 'Conference C', '2022-11-01'),
('Paper 12', 'Conference C', '2022-12-01'),
('Paper 13', 'Conference C', '2023-01-01'),
('Paper 14', 'Conference C', '2023-02-01'),
('Paper 15', 'Conference C', '2023-03-01'),
('Paper 16', 'Conference A', '2022-01-01'),
('Paper 17', 'Conference A', '2022-02-01'),
('Paper 18', 'Conference A', '2022-03-01'),
('Paper 19', 'Conference A', '2022-04-01'),
('Paper 20', 'Conference A', '2022-05-01'),
('Paper 21', 'Conference B', '2022-06-01'),
('Paper 22', 'Conference B', '2022-07-01'),
('Paper 23', 'Conference B', '2022-08-01'),
('Paper 24', 'Conference B', '2022-09-01'),
('Paper 25', 'Conference B', '2022-12-11'),
('Paper 26', 'Conference C', '2022-07-08'),
('Paper 27', 'Conference C', '2022-07-07'),
('Paper 28', 'Conference A', '2022-03-11'),
('Paper 29', 'Conference B', '2022-10-10'),
('Paper 30', 'Conference A', '2022-11-11'),
    )`,
  (err, results) => {
    if (err) throw err;
    console.log("Data inserted into research_papers table...");
  }
);
