import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();
import { setup } from "./setup.js";

const URI = process.env.MONGODB_URL;
const client = new MongoClient(URI);

async function main() {
  await setup();
  await transferMoney("101", "102", 400, "transfer");
}

async function transferMoney(
  fromAccountNumber,
  toAccountNumber,
  amount,
  remark
) {
  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      await client.connect();
      console.log("Connected to MongoDB");

      const db = client.db("databaseWeek4");
      const accounts = db.collection("accounts");

      const fromAccount = await accounts.findOne(
        {
          account_number: fromAccountNumber,
        },
        { session }
      );
      const toAccount = await accounts.findOne(
        {
          account_number: toAccountNumber,
        },
        { session }
      );

      // Check if both accounts exist
      if (!fromAccount || !toAccount) {
        throw new Error("One or more accounts do not exist");
      }

      // Check if fromAccount has enough balance
      if (fromAccount.balance < amount) {
        throw new Error("Insufficient balance");
      }

      const timestamp = new Date();

      // Update fromAccount
      const fromBalance = fromAccount.balance - amount;
      const fromChangeNumber = fromAccount.account_changes.length + 1;
      const fromChange = {
        change_number: fromChangeNumber,
        amount: -amount,
        changed_date: timestamp,
        remark: remark,
      };
      await accounts.updateOne(
        { account_number: fromAccountNumber },
        {
          $set: { balance: fromBalance },
          $push: { account_changes: fromChange },
        },
        { session }
      );

      // Update toAccount
      const toBalance = toAccount.balance + amount;
      const toChangeNumber = toAccount.account_changes.length + 1;
      const toChange = {
        change_number: toChangeNumber,
        amount: amount,
        changed_date: timestamp,
        remark: remark,
      };
      await accounts.updateOne(
        { account_number: toAccountNumber },
        {
          $set: { balance: toBalance },
          $push: { account_changes: toChange },
        },
        { session }
      );

      console.log(
        `Transferred ${amount} from account ${fromAccountNumber} to account ${toAccountNumber}`
      );
    });
  } catch (err) {
    console.error(err);
  } finally {
    await session.endSession();
    await client.close();
  }
}

main();
