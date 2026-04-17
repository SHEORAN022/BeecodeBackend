const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;

    // 🔥 TYPE CHECK
    if (decoded.type === "admin") {
      user = await Admin.findById(decoded.id).select("-password");
      req.userType = "admin";
    } else {
      user = await User.findById(decoded.id).select("-password");
      req.userType = "user";
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();

  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};