const User = require("../models/User");
const { server } = require("../server");

describe("Performance Tests", () => {
  const NUM_REQUESTS = 500;

  jest.setTimeout(15000);

  afterAll(async () => {
    await User.deleteMany({});
    await server.close();
  });

  test("GET /games endpoint performance", async () => {
    const responseTimes = [];

    for (let i = 0; i < NUM_REQUESTS; i++) {
      const startTime = process.hrtime();
      await fetch("http://localhost:3000/games");
      const endTime = process.hrtime(startTime);
      const responseTime = endTime[0] * 1000 + endTime[1] / 1000000;
      responseTimes.push(responseTime);
    }
    const avg = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    console.log("\nPerformance Test Results for GET /games:");
    console.log(`Number of requests: ${NUM_REQUESTS}`);
    console.log(`Average response time: ${avg.toFixed(2)}ms`);
    expect(avg).toBeLessThan(500);
  });

  test("POST /auth/register stress test", async () => {
    const responseTimes = [];
    const baseTime = Date.now();
    for (let i = 0; i < NUM_REQUESTS; i++) {
      const startTime = process.hrtime();
      const uniqueId = `${baseTime}_${i}`;
      const userData = {
        firstName: `Test${uniqueId}`,
        lastName: `User${uniqueId}`,
        email: `test_${uniqueId}@example.com`,
        password: "Test123456",
        mobile: "1234567890",
        gender: "male",
      };

      await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const endTime = process.hrtime(startTime);
      const responseTime = endTime[0] * 1000 + endTime[1] / 1000000;
      responseTimes.push(responseTime);
    }

    const avg = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    console.log("\nStress Test Results for POST /auth/register:");
    console.log(`Number of requests: ${NUM_REQUESTS}`);
    console.log(`Average response time: ${avg.toFixed(2)}ms`);
    expect(avg).toBeLessThan(1000);
  });
});
