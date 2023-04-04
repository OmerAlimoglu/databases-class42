const mysql = require("mysql2/promise");

async function transferAmount() {
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

    const [account1] = await connection.query(
      "SELECT * FROM account WHERE account_number = ? FOR UPDATE",
      [101]
    );

    const [account2] = await connection.query(
      "SELECT * FROM account WHERE account_number = ? FOR UPDATE",
      [102]
    );

    if (account1.balance >= 1000) {
      await connection.query(
        "UPDATE account SET balance = balance - ? WHERE account_number = ?",
        [1000, 101]
      );

      await connection.query(
        "UPDATE account SET balance = balance + ? WHERE account_number = ?",
        [1000, 102]
      );

      await connection.query(
        "INSERT INTO account_changes (account_number, amount, remark) VALUES (?, ?, ?)",
        [101, -1000, "Transfer to account 102"]
      );

      await connection.query(
        "INSERT INTO account_changes (account_number, amount, remark) VALUES (?, ?, ?)",
        [102, 1000, "Transfer from account 101"]
      );

      await connection.commit();

      const [newAccount1] = await connection.query(
        "SELECT * FROM account WHERE account_number = ?",
        [101]
      );

      const [newAccount2] = await connection.query(
        "SELECT * FROM account WHERE account_number = ?",
        [102]
      );

      console.log("Transfer successful!");
      console.log(`Account 101 balance: ${newAccount1.balance}`);
      console.log(`Account 102 balance: ${newAccount2.balance}`);
    } else {
      console.log("Insufficient balance.");
    }
  } catch (error) {
    await connection.rollback();
    console.log(error);
  } finally {
    connection.release();
    pool.end();
  }
}

transferAmount();
