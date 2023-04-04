const mysql = require("mysql2/promise");

async function insertSampleData() {
  const pool = mysql.createPool({
    host: "localhost",
    user: "hyfuser",
    password: "hyfpassword",
    database: "ex-2",
    multipleStatements: true,
  });

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      "INSERT INTO account (account_number, balance) VALUES (?, ?)",
      [1, 1000.0]
    );
    await connection.query(
      "INSERT INTO account (account_number, balance) VALUES (?, ?)",
      [2, 5000.0]
    );

    await connection.query(
      "INSERT INTO account_changes (account_number, amount, remark) VALUES (?, ?, ?)",
      [1, -500.0, "Withdrawal"]
    );
    await connection.query(
      "INSERT INTO account_changes (account_number, amount, remark) VALUES (?, ?, ?)",
      [1, 1000.0, "Deposit"]
    );
    await connection.query(
      "INSERT INTO account_changes (account_number, amount, remark) VALUES (?, ?, ?)",
      [2, -2500.0, "Withdrawal"]
    );
    await connection.query(
      "INSERT INTO account_changes (account_number, amount, remark) VALUES (?, ?, ?)",
      [2, 5000.0, "Deposit"]
    );

    await connection.commit();
    console.log("Sample data inserted successfully..");
  } catch (error) {
    await connection.rollback();
    console.log(error);
  } finally {
    connection.release();
    pool.end();
  }
}

insertSampleData();
