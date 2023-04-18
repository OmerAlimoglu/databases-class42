import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();

const URI = process.env.MONGODB_URL;
const client = new MongoClient(URI);

export async function setup() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("databaseWeek4");
    const accounts = db.collection("accounts");

    // Clean up accounts collection
    await accounts.deleteMany({});

    // Insert sample data
    const sampleAccounts = [
      {
        account_number: "101",
        balance: 5000,
        account_changes: [
          {
            change_number: 1,
            amount: 5000,
            changed_date: new Date(),
            remark: "Initial deposit",
          },
        ],
      },
      {
        account_number: "102",
        balance: 10000,
        account_changes: [
          {
            change_number: 1,
            amount: 10000,
            changed_date: new Date(),
            remark: "Initial deposit",
          },
        ],
      },
    ];

    await accounts.insertMany(sampleAccounts);
    console.log("Sample data inserted");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}
