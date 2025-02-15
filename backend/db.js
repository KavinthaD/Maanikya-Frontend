const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://kavinthad03:KbCNYmQ9AgXOQjXu@cluster0.swvce.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    // Optionally, list databases to verify connection
    const databasesList = await client.db().admin().listDatabases();
    console.log(
      "Databases:",
      databasesList.databases.map((db) => db.name)
    );
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

module.exports = connectDB;
