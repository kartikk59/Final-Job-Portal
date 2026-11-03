const mongoose = require("mongoose");

async function connectDatabase() {
  if (process.env.USE_IN_MEMORY_DB === "true") {
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri("job-portal-new"));
    console.log("In-memory MongoDB connected (development)");
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Set MONGO_URI in Backend/.env, or USE_IN_MEMORY_DB=true for local demo.");
  }

  await mongoose.connect(process.env.MONGO_URI, {
    family: 4,
    serverSelectionTimeoutMS: 20000,
  });
  console.log("MongoDB connected using MONGO_URI");
}

module.exports = connectDatabase;
