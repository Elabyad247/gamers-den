const {
  isAuthenticated,
  isAdmin,
  isNotAuthenticated,
} = require("../../middleware/auth");

describe("Authentication Middleware", () => {
  let req, res, next, nextCalled, statusCode, jsonResponse;

  beforeEach(() => {
    req = {
      session: {},
    };

    nextCalled = false;
    statusCode = null;
    jsonResponse = null;

    next = () => {
      nextCalled = true;
    };

    res = {
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (data) => {
        jsonResponse = data;
        return res;
      },
    };
  });

  describe("isAuthenticated middleware", () => {
    test("should call next() when user is authenticated", () => {
      req.session.user = { id: "123", name: "Test User" };

      isAuthenticated(req, res, next);

      expect(nextCalled).toBeTruthy();
      expect(statusCode).toBeNull();
      expect(jsonResponse).toBeNull();
    });

    test("should return 401 when user is not authenticated", () => {
      req.session.user = null;

      isAuthenticated(req, res, next);

      expect(nextCalled).toBeFalsy();
      expect(statusCode).toBe(401);
      expect(jsonResponse).toMatchObject({
        message: "Authentication required",
      });
    });
  });

  describe("isAdmin middleware", () => {
    test("should call next() when user is an admin", () => {
      req.session.user = { id: "123", role: "admin" };

      isAdmin(req, res, next);

      expect(nextCalled).toBeTruthy();
      expect(statusCode).toBeNull();
      expect(jsonResponse).toBeNull();
    });

    test("should return 403 when user is not an admin", () => {
      req.session.user = { id: "123", role: "user" };

      isAdmin(req, res, next);

      expect(nextCalled).toBeFalsy();
      expect(statusCode).toBe(403);
      expect(jsonResponse).toHaveProperty("message", "Admin access required");
    });
  });

  describe("isNotAuthenticated middleware", () => {
    test("should call next() when user is not authenticated", () => {
      req.session.user = null;

      isNotAuthenticated(req, res, next);

      expect(nextCalled).toBeTruthy();
      expect(statusCode).toBeNull();
      expect(jsonResponse).toBeNull();
    });

    test("should return 400 when user is already authenticated", () => {
      req.session.user = { id: "123", name: "Test User" };

      isNotAuthenticated(req, res, next);

      expect(nextCalled).toBeFalsy();
      expect(statusCode).toBe(400);
      expect(jsonResponse).toMatchObject({
        message: "Already authenticated",
      });
      expect(jsonResponse).toHaveProperty("redirect", true);
    });
  });
});
