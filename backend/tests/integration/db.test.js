const mongoose = require("mongoose");
const { connectDB, disconnectDB } = require("../../utils/db");

describe("MongoDB Connection", () => {
  test("should connect to MongoDB without throwing", async () => {
    await expect(connectDB()).resolves.not.toThrow();
    expect(mongoose.connection.readyState).toBe(1);
  });

  test("should disconnect from MongoDB without throwing", async () => {
    await connectDB();
    await expect(disconnectDB()).resolves.not.toThrow();
    expect(mongoose.connection.readyState).toBe(0);
  });
});
