const fs = require("fs");
const csv = require("csv-parser");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const URI = process.env.MONGODB_URL;

async function main() {
  const client = new MongoClient(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("databaseWeek4");
    const collection = database.collection("population");

    fs.createReadStream("population_pyramid_1950-2022.csv")
      .pipe(csv())
      .on("data", async (data) => {
        const document = {
          Country: data.Country,
          Year: parseInt(data.Year),
          Age: data.Age,
          M: parseInt(data.M),
          F: parseInt(data.F),
        };

        await collection.insertOne(document);
      })
      .on("end", async () => {
        console.log("Data inserted successfully");
      });

    // total population for given country per year
    const result1 = await getTotalPopulationByYear(database, "Netherlands");
    console.log(result1);

    // total population for each continent per year and age
    const result2 = await getTotalPopulationByContinentYearAndAge(
      database,
      2019,
      "25-29"
    );
    console.log(result2);
    await client.close();
  } catch (e) {
    console.error(e);
  } finally {
    // await client.close();
  }
}

async function getTotalPopulationByYear(database, country) {
  const pipeline = [
    {
      $match: { Country: country },
    },
    {
      $group: {
        _id: "$Year",
        countPopulation: {
          $sum: {
            $add: ["$M", "$F"],
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        countPopulation: 1,
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ];
  const result = await database
    .collection("population")
    .aggregate(pipeline)
    .toArray();
  return result;
}

async function getTotalPopulationByContinentYearAndAge(database, year, age) {
  const pipeline = [
    {
      $match: {
        Country: {
          $in: [
            "ASIA",
            "AFRICA",
            "EUROPE",
            "LATIN AMERICA AND THE CARIBBEAN",
            "NORTHERN AMERICA",
            "OCEANIA",
          ],
        },
        Year: year,
        Age: age,
      },
    },
    {
      $addFields: {
        TotalPopulation: {
          $sum: {
            $add: ["$M", "$F"],
          },
        },
      },
    },
  ];

  const result = await database
    .collection("population")
    .aggregate(pipeline)
    .toArray();
  return result;
}

main().catch(console.error);
