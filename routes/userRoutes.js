const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  googleLogin,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// 🔐 Auth
router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleLogin);

// 👤 PROFILE (🔥 ye upar hona chahiye)
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// 📦 CRUD
router.get("/all", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;