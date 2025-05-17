const {
  isValidEmail,
  isValidPassword,
  isValidMobile,
  isValidUrl,
  validateUserData,
  validateGameData,
  validateLoginRequest,
  validateRegisterRequest,
  validateGameRequest,
} = require("../../utils/validators");

describe("Validator Middleware Functions", () => {
  let req, res, next, nextCalled, statusCode, jsonResponse;

  beforeEach(() => {
    req = {
      body: {},
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

  describe("validateLoginRequest middleware", () => {
    test("should call next() when login data is valid", () => {
      req.body = {
        email: "user@example.com",
        password: "password123",
      };

      validateLoginRequest(req, res, next);

      expect(nextCalled).toBeTruthy();
      expect(statusCode).toBeNull();
      expect(jsonResponse).toBeNull();
    });

    test("should return 400 when email is missing", () => {
      req.body = {
        password: "password123",
      };

      validateLoginRequest(req, res, next);

      expect(nextCalled).toBeFalsy();
      expect(statusCode).toBe(400);
      expect(jsonResponse).toHaveProperty("message", "Email is required");
    });

    test("should return 400 when password is missing", () => {
      req.body = {
        email: "user@example.com",
      };

      validateLoginRequest(req, res, next);

      expect(nextCalled).toBeFalsy();
      expect(statusCode).toBe(400);
      expect(jsonResponse).toHaveProperty("message", "Password is required");
    });
  });

  describe("validateRegisterRequest middleware", () => {
    test("should call next() when register data is valid", () => {
      req.body = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "password123",
        mobile: "1234567890",
        gender: "male",
      };

      validateRegisterRequest(req, res, next);

      expect(nextCalled).toBeTruthy();
      expect(statusCode).toBeNull();
      expect(jsonResponse).toBeNull();
    });

    test("should return 400 when register data is invalid", () => {
      req.body = {
        firstName: "",
        lastName: "Doe",
        email: "invalid-email",
        password: "short",
        mobile: "123",
        gender: "unknown",
      };

      validateRegisterRequest(req, res, next);

      expect(nextCalled).toBeFalsy();
      expect(statusCode).toBe(400);
      expect(jsonResponse).toHaveProperty("message", "Validation failed");
      expect(jsonResponse).toHaveProperty("errors");
    });
  });

  describe("validateGameRequest middleware", () => {
    test("should call next() when game data is valid", () => {
      req.body = {
        title: "Game Title",
        description: "This is a game description that is long enough",
        price: 59.99,
        category: "Action",
        image: "https://example.com/image.jpg",
      };

      validateGameRequest(req, res, next);

      expect(nextCalled).toBeTruthy();
      expect(statusCode).toBeNull();
      expect(jsonResponse).toBeNull();
    });

    test("should return 400 when game data is invalid", () => {
      req.body = {
        title: "A",
        description: "Short",
        price: -10,
        category: "A",
        image: "invalid-url",
      };

      validateGameRequest(req, res, next);

      expect(nextCalled).toBeFalsy();
      expect(statusCode).toBe(400);
      expect(jsonResponse).toHaveProperty("message", "Validation failed");
      expect(jsonResponse).toHaveProperty("errors");
    });
  });
});

describe("Email Validation", () => {
  test("valid emails should return true", () => {
    expect(isValidEmail("user@example.com")).toBeTruthy();
    expect(isValidEmail("name.lastname@domain.co.uk")).toBeTruthy();
    expect(isValidEmail("email@subdomain.example.com")).toBeTruthy();
  });

  test("invalid emails should return false", () => {
    expect(isValidEmail("")).toBeFalsy();
    expect(isValidEmail("plaintext")).toBeFalsy();
    expect(isValidEmail("email@")).toBeFalsy();
    expect(isValidEmail("@domain.com")).toBeFalsy();
    expect(isValidEmail("user@.com")).toBeFalsy();
    expect(isValidEmail(null)).toBeFalsy();
    expect(isValidEmail(undefined)).toBeFalsy();
  });
});

describe("Password Validation", () => {
  test("valid passwords should return true", () => {
    expect(isValidPassword("password123")).toBeTruthy();
    expect(isValidPassword("secureP4ssword")).toBeTruthy();
    expect(isValidPassword("12345678")).toBeTruthy();
  });

  test("invalid passwords should return false", () => {
    expect(isValidPassword("")).toBeFalsy();
    expect(isValidPassword("short1")).toBeFalsy();
    expect(isValidPassword("longpasswordwithoutdigits")).toBeFalsy();
    expect(isValidPassword(null)).toBeFalsy();
    expect(isValidPassword(undefined)).toBeFalsy();
  });
});

describe("Mobile Validation", () => {
  test("valid mobile numbers should return true", () => {
    expect(isValidMobile("1234567890")).toBeTruthy();
    expect(isValidMobile("123456789012")).toBeTruthy();
    expect(isValidMobile("123456789011")).toBeTruthy();
  });

  test("invalid mobile numbers should return false", () => {
    expect(isValidMobile("")).toBeFalsy();
    expect(isValidMobile("123")).toBeFalsy();
    expect(isValidMobile("123456789")).toBeFalsy();
    expect(isValidMobile("1234567890123")).toBeFalsy();
    expect(isValidMobile("abc1234567890")).toBeFalsy();
    expect(isValidMobile(null)).toBeFalsy();
    expect(isValidMobile(undefined)).toBeFalsy();
  });
});

describe("URL Validation", () => {
  test("valid URLs should return true", () => {
    expect(isValidUrl("http://example.com")).toBeTruthy();
    expect(isValidUrl("https://example.com")).toBeTruthy();
    expect(isValidUrl("https://subdomain.example.com/path")).toBeTruthy();
  });

  test("invalid URLs should return false", () => {
    expect(isValidUrl("")).toBeFalsy();
    expect(isValidUrl("example.com")).toBeFalsy();
    expect(isValidUrl("ftp://example.com")).toBeFalsy();
    expect(isValidUrl("http:/example")).toBeFalsy();
    expect(isValidUrl(null)).toBeFalsy();
    expect(isValidUrl(undefined)).toBeFalsy();
  });

  test("should return false when URL parsing throws an error", () => {
    expect(isValidUrl("http://[invalid-url")).toBeFalsy();
    expect(isValidUrl("https://example.com:-80/")).toBeFalsy();
    expect(isValidUrl("http://")).toBeFalsy();
    expect(isValidUrl("://example.com")).toBeFalsy();
    expect(isValidUrl("http://:80")).toBeFalsy();
  });
});

describe("User Data Validation", () => {
  test("should validate correct user data", () => {
    const validUser = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
      mobile: "1234567890",
      gender: "male",
    };

    const result = validateUserData(validUser);
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toEqual({});
    expect(result.errors).toBeInstanceOf(Object);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  test("should return error when lastName is missing or empty", () => {
    const userWithoutLastName = {
      firstName: "John",
      lastName: "",
      email: "john@example.com",
      password: "password123",
      mobile: "1234567890",
      gender: "male",
    };

    const result = validateUserData(userWithoutLastName);
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveProperty("lastName", "Last name is required");
  });

  test("should return errors for invalid user data", () => {
    const invalidUser = {
      firstName: "",
      lastName: "Doe",
      email: "invalid-email",
      password: "short",
      mobile: "123",
      gender: "unknown",
    };

    const result = validateUserData(invalidUser);
    expect(result.isValid).toBeFalsy();
    expect(result.errors).not.toBeNull();
    expect(result.errors).toBeInstanceOf(Object);
    expect(Object.keys(result.errors)).not.toHaveLength(0);
    expect(result.errors).toHaveProperty("firstName");
    expect(result.errors).toHaveProperty("email");
    expect(result.errors).toHaveProperty("password");
    expect(result.errors).toHaveProperty("mobile");
    expect(result.errors).toHaveProperty("gender");
  });

  test("should validate partial user data correctly", () => {
    const partialUser = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "password123",
    };

    const result = validateUserData(partialUser);
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveProperty("mobile");
    expect(result.errors).toHaveProperty("gender");
  });
});

describe("Game Data Validation", () => {
  test("should validate correct game data", () => {
    const validGame = {
      title: "Game Title",
      description: "This is a game description that is long enough",
      price: 59.99,
      category: "Action",
      image: "https://example.com/image.jpg",
      rating: 4.5,
    };

    const result = validateGameData(validGame);
    expect(result.isValid).toBeTruthy();
    expect(result.errors).toEqual({});
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  test("should return error when title is missing", () => {
    const gameWithoutTitle = {
      description: "This is a game description that is long enough",
      price: 59.99,
      category: "Action",
      image: "https://example.com/image.jpg",
    };

    const result = validateGameData(gameWithoutTitle);
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveProperty("title", "Title is required");
  });

  test("should return error when description is missing", () => {
    const gameWithoutDescription = {
      title: "Game Title",
      price: 59.99,
      category: "Action",
      image: "https://example.com/image.jpg",
    };

    const result = validateGameData(gameWithoutDescription);
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveProperty(
      "description",
      "Description is required"
    );
  });

  test("should return errors for invalid game data", () => {
    const invalidGame = {
      title: "A",
      description: "Short",
      price: -10,
      category: "A",
      image: "invalid-url",
      rating: 6,
    };

    const result = validateGameData(invalidGame);
    expect(result.isValid).toBeFalsy();
    expect(result.errors).not.toBeNull();
    expect(result.errors).toBeInstanceOf(Object);
    expect(Object.keys(result.errors)).not.toHaveLength(0);
    expect(result.errors).toHaveProperty("title");
    expect(result.errors).toHaveProperty("description");
    expect(result.errors).toHaveProperty("price");
    expect(result.errors).toHaveProperty("image");
    expect(result.errors).toHaveProperty("rating");
  });

  test("should accept free games with price 0", () => {
    const freeGame = {
      title: "Free Game",
      description: "This is a free game description",
      price: 0,
      category: "Free",
      image: "https://example.com/free.jpg",
    };

    const result = validateGameData(freeGame);
    expect(result.isValid).toBeTruthy();
  });

  test("should validate partial game data correctly", () => {
    const partialGame = {
      title: "Game Title",
      description: "This is a game description",
    };

    const result = validateGameData(partialGame);
    expect(result.isValid).toBeFalsy();
    expect(result.errors).toHaveProperty("price");
    expect(result.errors).toHaveProperty("category");
    expect(result.errors).toHaveProperty("image");
  });
});
