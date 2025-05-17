const request = require("supertest");
const { app, server } = require("../../server");
const Game = require("../../models/Game");
const User = require("../../models/User");
const bcrypt = require("bcrypt");

describe("Games API", () => {
  afterAll(async () => {
    await server.close();
  });

  describe("GET /games", () => {
    it("should return all games", async () => {
      await Game.create([
        {
          title: "Test Game 1",
          description: "Test description 1",
          price: 59.99,
          category: "Action",
          image: "https://example.com/images/test1.jpg",
          rating: 4.5,
        },
        {
          title: "Test Game 2",
          description: "Test description 2",
          price: 49.99,
          category: "Adventure",
          image: "https://example.com/images/test2.jpg",
          rating: 4.2,
        },
      ]);

      const response = await request(app).get("/games");
      expect(response.status).toBe(200);
      expect(response.body.games).toHaveLength(2);
    });

    it("should return empty array when no games", async () => {
      const response = await request(app).get("/games");

      expect(response.status).toBe(200);
      expect(response.body.games).toHaveLength(0);
    });
  });

  describe("GET /games/:id", () => {
    it("should return a single game by ID", async () => {
      const game = await Game.create({
        title: "Single Test Game",
        description: "Test description",
        price: 59.99,
        category: "Action",
        image: "https://example.com/images/test.jpg",
        rating: 4.5,
      });

      const response = await request(app).get(`/games/${game._id}`);

      expect(response.status).toBe(200);
      expect(response.body.game.title).toBe("Single Test Game");
      expect(response.body.game._id.toString()).toBe(game._id.toString());
    });

    it("should return 404 for non-existent game ID", async () => {
      const nonExistentId = "60f5e4c77a3d982c10954367";
      const response = await request(app).get(`/games/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Game not found");
    });

    it("should handle invalid ID format", async () => {
      const invalidId = "invalid-id";
      const response = await request(app).get(`/games/${invalidId}`);

      expect(response.status).toBe(500);
    });
  });

  describe("POST /games", () => {
    let adminCookie;

    const loginAsAdmin = async () => {
      const password = "AdminPass123!";
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        password: hashedPassword,
        mobile: "1234567890",
        gender: "male",
        role: "admin",
      });

      const response = await request(app).post("/auth/login").send({
        email: "admin@example.com",
        password: "AdminPass123!",
      });

      const cookies = response.headers["set-cookie"];
      return cookies ? cookies[0].split(";")[0] : null;
    };

    beforeEach(async () => {
      adminCookie = await loginAsAdmin();
    });

    it("should create a new game when admin is authenticated", async () => {
      const newGame = {
        title: "New Game",
        description: "New game description",
        price: 49.99,
        category: "Strategy",
        image: "https://example.com/images/newgame.jpg",
        rating: 0,
      };

      const response = await request(app)
        .post("/games")
        .set("Cookie", adminCookie)
        .send(newGame);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Game created successfully");
      expect(response.body.game.title).toBe("New Game");

      const game = await Game.findOne({ title: "New Game" });
      expect(game).toBeTruthy();
      expect(game.price).toBe(49.99);
    });

    it("should not allow game creation without authentication", async () => {
      const newGame = {
        title: "Unauthenticated Game",
        description: "Should not be created",
        price: 39.99,
        category: "RPG",
        image: "https://example.com/images/unauthgame.jpg",
      };

      const response = await request(app).post("/games").send(newGame);

      expect(response.status).toBe(401);

      const game = await Game.findOne({ title: "Unauthenticated Game" });
      expect(game).toBeNull();
    });
  });

  describe("PUT /games/:id", () => {
    let adminCookie;
    let gameId;

    beforeEach(async () => {
      const password = "AdminPass123!";
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        password: hashedPassword,
        mobile: "1234567890",
        gender: "male",
        role: "admin",
      });

      const loginResp = await request(app).post("/auth/login").send({
        email: "admin@example.com",
        password: "AdminPass123!",
      });

      adminCookie = loginResp.headers["set-cookie"];

      const game = await Game.create({
        title: "Update Test Game",
        description: "Will be updated",
        price: 29.99,
        category: "Simulation",
        image: "https://example.com/images/update.jpg",
        rating: 3.5,
      });

      gameId = game._id;
    });

    it("should update a game when admin is authenticated", async () => {
      const updatedData = {
        title: "Updated Game Title",
        description: "Updated description",
        price: 39.99,
        category: "Simulation",
        image: "https://example.com/images/updated.jpg",
        rating: 4.0,
      };

      const response = await request(app)
        .put(`/games/${gameId}`)
        .set("Cookie", adminCookie)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Game updated successfully");
      expect(response.body.game.title).toBe("Updated Game Title");
      expect(response.body.game.price).toBe(39.99);

      const game = await Game.findById(gameId);
      expect(game.title).toBe("Updated Game Title");
      expect(game.description).toBe("Updated description");
    });

    it("should return 404 if game not found", async () => {
      const nonExistentId = "60f5e4c77a3d982c10954367";

      const response = await request(app)
        .put(`/games/${nonExistentId}`)
        .set("Cookie", adminCookie)
        .send({
          title: "This Game Does Not Exist",
          description: "Should not update",
          price: 19.99,
          category: "Unknown",
          image: "https://example.com/images/notfound.jpg",
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Game not found");
    });
  });

  describe("DELETE /games/:id", () => {
    let adminCookie;
    let gameId;

    beforeEach(async () => {
      const password = "AdminPass123!";
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        password: hashedPassword,
        mobile: "1234567890",
        gender: "male",
        role: "admin",
      });

      const loginResp = await request(app).post("/auth/login").send({
        email: "admin@example.com",
        password: "AdminPass123!",
      });

      adminCookie = loginResp.headers["set-cookie"];

      const game = await Game.create({
        title: "Delete Test Game",
        description: "Will be deleted",
        price: 19.99,
        category: "Puzzle",
        image: "https://example.com/images/delete.jpg",
        rating: 4.1,
      });

      gameId = game._id;
    });

    it("should delete a game when admin is authenticated", async () => {
      const response = await request(app)
        .delete(`/games/${gameId}`)
        .set("Cookie", adminCookie);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Game deleted successfully");

      const game = await Game.findById(gameId);
      expect(game).toBeNull();
    });

    it("should return 404 if game not found", async () => {
      const nonExistentId = "60f5e4c77a3d982c10954367";

      const response = await request(app)
        .delete(`/games/${nonExistentId}`)
        .set("Cookie", adminCookie);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Game not found");
    });

    it("should not allow deletion without authentication", async () => {
      const response = await request(app).delete(`/games/${gameId}`);

      expect(response.status).toBe(401);

      const game = await Game.findById(gameId);
      expect(game).toBeTruthy();
    });
  });
});
