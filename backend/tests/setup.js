const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/User");
const Game = require("../models/Game");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  process.env.MONGODB_URI = mongoUri;

  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  await mongoose.connect(mongoUri);
  await User.deleteMany({});
  await Game.deleteMany({});
});

afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    await User.deleteMany({});
    await Game.deleteMany({});
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  await mongoose.disconnect();

  if (mongoServer) {
    await mongoServer.stop();
  }

  delete process.env.MONGODB_URI;
});
