const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { connectDB } = require("./utils/db");
const authController = require("./controllers/authController");
const gameController = require("./controllers/gameController");
const {
  isAuthenticated,
  isNotAuthenticated,
  isAdmin,
} = require("./middleware/auth");
const {
  validateLoginRequest,
  validateRegisterRequest,
  validateGameRequest,
} = require("./utils/validators");

const PORT = 3000;

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: "20f2ee7cf9027a789108895f9b4a3ee6763e8fe984e86082c19d5875cf6637e5",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.post(
  "/auth/register",
  isNotAuthenticated,
  validateRegisterRequest,
  authController.register
);
app.post(
  "/auth/login",
  isNotAuthenticated,
  validateLoginRequest,
  authController.login
);
app.get("/auth/me", isAuthenticated, authController.getCurrentUser);
app.post("/auth/logout", isAuthenticated, authController.logout);

app.get("/games", gameController.getAllGames);
app.post(
  "/games",
  isAuthenticated,
  isAdmin,
  validateGameRequest,
  gameController.createGame
);
app.get("/games/:id", gameController.getGameById);
app.put(
  "/games/:id",
  isAuthenticated,
  isAdmin,
  validateGameRequest,
  gameController.updateGame
);
app.delete("/games/:id", isAuthenticated, isAdmin, gameController.deleteGame);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = { app };
