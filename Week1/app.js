import mysql from "mysql";
import { faker } from "@faker-js/faker";
import randomDatetime from "random-datetime";

const database = mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
});

database.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("mysql connected");
});

database.query("CREATE DATABASE IF NOT EXISTS meetup", (err, result) => {
  if (err) throw err;
  console.log("Database created..");
});

const db = mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "meetup",
});

db.query(
  `CREATE TABLE IF NOT EXISTS Invitee (
    invitee_no INT AUTO_INCREMENT PRIMARY KEY,
    invitee_name VARCHAR(255) NOT NULL,
    invited_by VARCHAR(255) NOT NULL
  )`,
  (err, results) => {
    if (err) throw err;
    console.log("Invitee table created!");
  }
);

db.query(
  `CREATE TABLE IF NOT EXISTS Room (
        room_no INT AUTO_INCREMENT PRIMARY KEY,
        room_name VARCHAR(255) NOT NULL,
        floor_number VARCHAR(255) NOT NULL
    )`,
  (err, results) => {
    if (err) throw err;
    console.log("Room table created!");
  }
);

db.query(
  `CREATE TABLE IF NOT EXISTS Meeting (
        meeting_no INT AUTO_INCREMENT PRIMARY KEY,
        meeting_title VARCHAR(255) NOT NULL,
        starting_time DATETIME NOT NULL,
        ending_time DATETIME NOT NULL,
        room_no INT NOT NULL
      )`,
  (err, results) => {
    if (err) throw err;
    console.log("Meeting table created!");
  }
);

for (let i = 0; i < 5; i++) {
  const randomInviteeName = faker.name.fullName();
  const randomInvitedBy = faker.name.fullName();
  db.query(
    `INSERT IGNORE INTO Invitee (invitee_name, invited_by) VALUES ("${randomInviteeName}", "${randomInvitedBy}")`,
    (err, results) => {
      if (err) throw err;
      console.log("Data inserted into Invitee table...");
    }
  );
}

for (let i = 0; i < 5; i++) {
  const roomName = faker.random.word();
  const floorNumber = faker.datatype.number();
  db.query(
    `INSERT IGNORE INTO Room  (room_name, floor_number) VALUES ("${roomName}", '${floorNumber}')`,
    (err, results) => {
      if (err) throw err;
      console.log("Data inserted into Room table...");
    }
  );
}

for (let i = 0; i < 5; i++) {
  const meeting_title = faker.random.word();
  const room_no = faker.datatype.number();
  db.query(
    `INSERT IGNORE INTO Meeting  (meeting_title, starting_time, ending_time, room_no) VALUES ("${meeting_title}", NOW(), '2023-03-24', '${room_no}')`,
    (err, results) => {
      if (err) throw err;
      console.log("Data inserted into Meeting table...");
    }
  );
}
