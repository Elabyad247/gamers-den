const request = require("supertest");
const bcrypt = require("bcrypt");
const { app, server } = require("../server");
const User = require("../models/User");

describe("Security Tests", () => {
  afterAll(async () => {
    await server.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("Passwords should be hashed using bcrypt", async () => {
    const password = "testPassword123";
    const hashedPassword = await bcrypt.hash(password, 10);

    expect(hashedPassword).not.toBe(password);
    expect(hashedPassword.startsWith("$2b$")).toBe(true);
    const isMatch = await bcrypt.compare(password, hashedPassword);
    expect(isMatch).toBe(true);
  });

  test("Session cookie should have secure flags", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    const cookies = response.headers["set-cookie"];
    if (cookies) {
      const sessionCookie = cookies.find((cookie) =>
        cookie.startsWith("connect.sid")
      );
      if (sessionCookie) {
        expect(sessionCookie).toContain("HttpOnly");
      }
    }
  });

  test("CORS should be properly configured", async () => {
    const response = await request(app)
      .options("/games")
      .set("Origin", "http://localhost:3001");

    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://localhost:3001"
    );
    expect(response.headers["access-control-allow-credentials"]).toBe("true");
  });

  test("Protected routes should require authentication", async () => {
    const response = await request(app).get("/auth/me").set("Cookie", []);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Authentication required");
  });

  test("Admin routes should require admin privileges", async () => {
    const response = await request(app).post("/games").send({
      title: "Test Game",
      price: 29.99,
      description: "Test game",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Authentication required");
  });

  test("API should reject invalid game input", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      mobile: "1234567890",
      gender: "male",
    });

    const agent = request.agent(app);
    await agent
      .post("/auth/login")
      .send({
        email: "admin@example.com",
        password: "password123",
      })
      .expect(200);

    const response = await agent.post("/games").send({
      title: "",
      price: "not-a-number",
      description: "Test game",
      category: "test",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(/Validation failed/);
  });
  test("API should include security headers", async () => {
    const response = await request(app).get("/games");
    expect(response.headers).toHaveProperty("x-xss-protection");
    expect(response.headers).toHaveProperty("x-content-type-options");
    expect(response.headers).toHaveProperty("x-frame-options");
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
  });
});
