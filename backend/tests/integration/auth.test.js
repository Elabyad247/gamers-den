const request = require("supertest");
const { app, server } = require("../../server");
const User = require("../../models/User");
const bcrypt = require("bcrypt");

describe("Authentication API", () => {
  afterAll(async () => {
    await server.close();
  });

  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const userData = {
        firstName: "Test",
        lastName: "User",
        email: "testuser@example.com",
        password: "Password123!",
        mobile: "1234567890",
        gender: "male",
      };

      const response = await request(app).post("/auth/register").send(userData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User created successfully");
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
    });

    it("should not register a user with existing email", async () => {
      const existingUser = {
        firstName: "Existing",
        lastName: "User",
        email: "existing@example.com",
        password: await bcrypt.hash("Password123!", 10),
        mobile: "9876543210",
        gender: "female",
        role: "user",
      };

      await User.create(existingUser);

      const response = await request(app).post("/auth/register").send({
        firstName: "Test",
        lastName: "User",
        email: "existing@example.com",
        password: "Password123!",
        mobile: "1234567890",
        gender: "male",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("User with this email already exists");
    });

    it("should not register a user with existing mobile", async () => {
      const existingUser = {
        firstName: "Mobile",
        lastName: "User",
        email: "mobileuser@example.com",
        password: await bcrypt.hash("Password123!", 10),
        mobile: "1111111111",
        gender: "male",
        role: "user",
      };
      await User.create(existingUser);
      const response = await request(app).post("/auth/register").send({
        firstName: "Test",
        lastName: "User",
        email: "newemail@example.com",
        password: "Password123!",
        mobile: "1111111111",
        gender: "male",
      });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "User with this mobile number already exists"
      );
    });

    it("should not register a user if required field is missing", async () => {
      const response = await request(app).post("/auth/register").send({
        firstName: "NoPass",
        lastName: "User",
        email: "nopass@example.com",
        mobile: "2222222222",
        gender: "male",
      });
      expect(response.status).toBe(400);
    });
  });

  describe("POST /auth/login", () => {
    it("should login user with valid credentials", async () => {
      const password = "Password123!";
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        firstName: "Login",
        lastName: "Test",
        email: "login@example.com",
        password: hashedPassword,
        mobile: "5555555555",
        gender: "male",
        role: "user",
      });

      const response = await request(app).post("/auth/login").send({
        email: "login@example.com",
        password: password,
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login successful");
      expect(response.body.user.email).toBe("login@example.com");
      expect(response.body.user._id).toBeTruthy();
    });

    it("should not login with invalid password", async () => {
      const hashedPassword = await bcrypt.hash("CorrectPassword123!", 10);

      await User.create({
        firstName: "Wrong",
        lastName: "Password",
        email: "wrong@example.com",
        password: hashedPassword,
        mobile: "1112223333",
        gender: "female",
        role: "user",
      });

      const response = await request(app).post("/auth/login").send({
        email: "wrong@example.com",
        password: "WrongPassword123!",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid password");
    });

    it("should not login with nonexistent user", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "nonexistent@example.com",
        password: "Password123!",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("User not found");
    });
  });

  describe("GET /auth/me", () => {
    it("should return 401 if Authentication required", async () => {
      const response = await request(app).get("/auth/me");
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Authentication required");
    });

    it("should return user info if authenticated", async () => {
      const agent = request.agent(app);
      const userData = {
        firstName: "Sess",
        lastName: "User",
        email: "sessuser@example.com",
        password: "Password123!",
        mobile: "1231231234",
        gender: "male",
      };
      await agent.post("/auth/register").send(userData);
      await agent.post("/auth/login").send({
        email: userData.email,
        password: userData.password,
      });
      const response = await agent.get("/auth/me");
      expect(response.status).toBe(200);
      expect(response.body.email).toBe(userData.email);
    });
  });

  describe("POST /auth/logout", () => {
    it("should logout and clear session", async () => {
      const agent = request.agent(app);
      const userData = {
        firstName: "Logout",
        lastName: "User",
        email: "logoutuser@example.com",
        password: "Password123!",
        mobile: "3213214321",
        gender: "female",
      };
      await agent.post("/auth/register").send(userData);
      await agent.post("/auth/login").send({
        email: userData.email,
        password: userData.password,
      });
      const logoutRes = await agent.post("/auth/logout");
      expect(logoutRes.status).toBe(200);
      expect(logoutRes.body.message).toMatch(/Logged out successfully/);
      const currentUserRes = await agent.get("/auth/me");
      expect(currentUserRes.status).toBe(401);
      expect(currentUserRes.body.message).toMatch(/Authentication required/);
    });
  });
});
