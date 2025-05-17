const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  return res.status(401).json({ message: "Authentication required" });
};

const isAdmin = (req, res, next) => {
  if (req.session.user.role === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Admin access required" });
};

const isNotAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return res
      .status(400)
      .json({ message: "Already authenticated", redirect: true });
  }
  return next();
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isNotAuthenticated,
};
