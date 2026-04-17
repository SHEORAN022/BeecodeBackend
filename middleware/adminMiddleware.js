exports.isAdmin = (req, res, next) => {
  if (req.userType === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }
};