const mysql = require("mysql2/promise");

async function createTables() {
  const pool = mysql.createPool({
    host: "localhost",
    user: "hyfuser",
    password: "hyfpassword",
    multipleStatements: true,
  });

  const connection = await pool.getConnection();

  try {
    await connection.query("CREATE DATABASE IF NOT EXISTS `ex-2`");
    console.log("Database created successfully..");
  } catch (error) {
    console.log(error);
  } finally {
    connection.release();
  }

  const database = mysql.createPool({
    host: "localhost",
    user: "hyfuser",
    password: "hyfpassword",
    database: "ex-2",
    multipleStatements: true,
  });

  const db = await database.getConnection();

  try {
    await db.query(`
          CREATE TABLE account (
          account_number INT PRIMARY KEY,
          balance DECIMAL(10,2) NOT NULL
          );
          
          CREATE TABLE account_changes (
          change_number INT PRIMARY KEY AUTO_INCREMENT,
          account_number INT NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          changed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          remark VARCHAR(255),
          FOREIGN KEY (account_number) REFERENCES account(account_number)
          )
          `);

    console.log("Tables created successfully.");
  } catch (error) {
    console.log(error);
  } finally {
    db.release();
  }
}

createTables();
