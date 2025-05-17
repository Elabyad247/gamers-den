const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email ? emailRegex.test(email) : false;
};

const isValidPassword = (password) => {
  if (!password || password.length < 8) return false;
  return /\d/.test(password);
};

const isValidMobile = (mobile) => {
  const mobileRegex = /^\d{10,12}$/;
  return mobile ? mobileRegex.test(mobile) : false;
};

const isValidUrl = (url) => {
  try {
    if (!url || typeof url !== "string") return false;

    const hasValidProtocol =
      url.startsWith("http://") || url.startsWith("https://");
    const hasValidFormat =
      /^https?:\/\/[a-zA-Z0-9][\w-.~:/?#[\]@!$&'()*+,;=]+$/.test(url);

    if (!hasValidProtocol || !hasValidFormat) return false;

    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch (e) {
    return false;
  }
};

const validateUserData = (userData) => {
  const { firstName, lastName, email, password, mobile, gender } = userData;
  const errors = {};
  if (!firstName || firstName.trim() === "") {
    errors.firstName = "First name is required";
  }
  if (!lastName || lastName.trim() === "") {
    errors.lastName = "Last name is required";
  }
  if (!email || !isValidEmail(email)) {
    errors.email = "Valid email is required";
  }
  if (!password || !isValidPassword(password)) {
    errors.password =
      "Password must be at least 8 characters with at least one number";
  }
  if (!mobile) {
    errors.mobile = "Mobile number is required";
  } else if (!isValidMobile(mobile)) {
    errors.mobile = "Valid mobile number is required (10-12 digits only)";
  }
  if (!gender || !["male", "female"].includes(gender)) {
    errors.gender = "Gender is required (male, female)";
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};

const validateGameData = (gameData) => {
  const errors = {};

  if (!gameData.title) {
    errors.title = "Title is required";
  } else if (gameData.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters long";
  }

  if (!gameData.description) {
    errors.description = "Description is required";
  } else if (gameData.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters long";
  }

  if (!gameData.price && gameData.price !== 0) {
    errors.price = "Price is required";
  } else if (
    isNaN(gameData.price) ||
    gameData.price < 0 ||
    gameData.price > 1000000
  ) {
    errors.price = "Price must be a positive number less than $1,000,000";
  }

  if (!gameData.category) {
    errors.category = "Category is required";
  } else if (gameData.category.trim().length < 2) {
    errors.category = "Category must be at least 2 characters long";
  }

  if (!gameData.image) {
    errors.image = "Image URL is required";
  } else if (!isValidUrl(gameData.image)) {
    errors.image = "Image must be a valid HTTP or HTTPS URL";
  }

  if (gameData.rating !== undefined && gameData.rating !== null) {
    if (isNaN(gameData.rating) || gameData.rating < 0 || gameData.rating > 5) {
      errors.rating = "Rating must be a number between 0 and 5";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateGameRequest = (req, res, next) => {
  const gameData = req.body;
  const validation = validateGameData(gameData);

  if (!validation.isValid) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.errors,
    });
  }

  next();
};

const validateLoginRequest = (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  next();
};

const validateRegisterRequest = (req, res, next) => {
  const userData = req.body;
  const validation = validateUserData(userData);

  if (!validation.isValid) {
    return res.status(400).json({
      message: "Validation failed",
      errors: validation.errors,
    });
  }

  next();
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidMobile,
  validateGameData,
  validateUserData,
  validateGameRequest,
  validateLoginRequest,
  validateRegisterRequest,
  isValidUrl,
};
