const bcrypt = require("bcrypt");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const userData = req.body;
    const { firstName, lastName, email, password, mobile, gender } = userData;
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    const existingUserByMobile = await User.findOne({ mobile });
    if (existingUserByMobile) {
      return res
        .status(400)
        .json({ message: "User with this mobile number already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobile,
      gender,
      role: "admin",
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not created due to some error" });
    }
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const userData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      gender: user.gender,
      role: user.role,
    };
    req.session.user = userData;
    res.status(200).json({ message: "Login successful", user: userData });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCurrentUser = (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: "Authentication required" });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully" });
  });
};

module.exports = {
  register,
  login,
  getCurrentUser,
  logout,
};
