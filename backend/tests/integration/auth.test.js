const request = require("supertest");
const { app } = require("../../server");
const User = require("../../models/User");
const bcrypt = require("bcrypt");

describe("Authentication API", () => {
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

  // For getCurrentUser and logout, we need to handle sessions which is more complex in testing
  // We would normally need an agent to maintain the session between requests
});
