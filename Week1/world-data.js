import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
  database: "world",
});

db.connect();

db.query("SELECT * FROM country", (error, results, fields) => {
  if (error) throw error;
  console.log("Database running...");
});

db.query(
  "SELECT * FROM country WHERE Population > 8000000",
  (error, results, fields) => {
    if (error) throw error;
    console.log("Countries with population greater than 8 million:");
    for (let i = 0; i < results.length; i++) {
      console.log(results[i].Name);
    }
  }
);

db.query(
  "SELECT * FROM country WHERE Name LIKE '%land%'",
  (error, results, fields) => {
    if (error) throw error;
    console.log("Countries that have 'land' in their names:");
    for (let i = 0; i < results.length; i++) {
      console.log(results[i].Name);
    }
  }
);

db.query(
  "SELECT * FROM city WHERE Population BETWEEN '500000' AND '1000000'",
  (error, results, fields) => {
    if (error) throw error;
    console.log("Cities with population between 500000 and 1 million:");
    for (let i = 0; i < results.length; i++) {
      console.log(results[i].Name);
    }
  }
);

db.query(
  "SELECT * FROM country WHERE Continent = 'Europe' ",
  (error, results, fields) => {
    if (error) throw error;
    console.log("Countries that are on the Europe continent:");
    for (let i = 0; i < results.length; i++) {
      console.log(results[i].Name);
    }
  }
);

db.query(
  "SELECT * FROM country ORDER BY SurfaceArea DESC ",
  (error, results, fields) => {
    if (error) throw error;
    console.log("Countries in the descending order of their surface areas:");
    for (let i = 0; i < results.length; i++) {
      console.log(results[i].Name);
    }
  }
);

db.query(
  "SELECT Name FROM city WHERE CountryCode ='NLD'",
  (error, results, fields) => {
    if (error) throw error;
    console.log("Cities are in Netherlands:");
    for (let i = 0; i < results.length; i++) {
      console.log(results[i].Name);
    }
  }
);

db.query(
  "SELECT Population FROM city WHERE Name = 'Rotterdam'",
  (error, result, fields) => {
    if (error) throw error;
    console.log(`The population of Rotterdam is: ${result[0].Population} `);
  }
);

db.query(
  "SELECT * FROM country ORDER BY SurfaceArea DESC LIMIT 10 ",
  (error, results, fields) => {
    if (error) throw error;
    console.log("The top 10 countries by surface areas:");
    for (let i = 0; i < results.length; i++) {
      console.log(results[i].Name);
    }
  }
);

db.query(
  "SELECT Name, Population FROM city ORDER BY Population DESC LIMIT 10",
  (error, results, fields) => {
    if (error) throw error;
    console.log("The top 10 cities by population:");
    for (let i = 0; i < results.length; i++) {
      console.log(results[i].Name);
    }
  }
);

db.query(
  "SELECT SUM(Population) AS 'World Population' FROM country",
  (error, result, fields) => {
    if (error) throw error;
    console.log(
      `Total population of the world: ${result[0]["World Population"]}`
    );
  }
);
