const fs = require("fs");
const csv = require("csv-parser");
const { MongoClient } = require("mongodb");

async function main() {
  const uri =
    "mongodb+srv://aoalimoglu:learningmongodb@cluster0.6j9s6kd.mongodb.net/databaseWeek4?retryWrites=true&w=majority";

  const client = new MongoClient(uri, {
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
      2020,
      "100+"
    );
    console.log(result2);
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
        Year: year,
        Age: age,
      },
    },
    {
      $lookup: {
        from: "continents",
        localField: "Country",
        foreignField: "countries",
        as: "continent",
      },
    },
    {
      $unwind: "$continent",
    },
    {
      $addFields: {
        TotalPopulation: { $add: ["$M", "$F"] },
      },
    },
    {
      $group: {
        _id: "$continent.name",
        Year: { $first: "$Year" },
        Age: { $first: "$Age" },
        M: { $sum: "$M" },
        F: { $sum: "$F" },
        TotalPopulation: { $sum: "$TotalPopulation" },
      },
    },
    {
      $project: {
        _id: 1,
        M: 1,
        F: 1,
        TotalPopulation: 1,
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
