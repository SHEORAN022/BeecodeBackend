const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const admin = require("../config/firebase");

// 🔐 Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id, role: "user" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};



// =====================================
// ✅ SIGNUP
// =====================================
exports.signup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    // 🔥 check passwords
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // 🔍 check user exist
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // ✅ create user
    const user = await User.create({
      fullName,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// =====================================
// 🔑 LOGIN
// =====================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔐 check password
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Please login with Google",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      user,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// =====================================
// 🔥 GOOGLE LOGIN
// =====================================
// exports.googleLogin = async (req, res) => {
//   try {
//     const { token } = req.body;

//     // 🔍 verify firebase token
//     const decoded = await admin.auth().verifyIdToken(token);

//     const { uid, email, name } = decoded;

//     let user = await User.findOne({ email });

//     // ✅ create user if not exists
//     if (!user) {
//       user = await User.create({
//         fullName: name,
//         email,
//         googleId: uid,
//       });
//     }

//     res.json({
//       success: true,
//       message: "Google login successful",
//       user,
//       token: generateToken(user._id),
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(401).json({
//       success: false,
//       message: "Google login failed",
//     });
//   }
// };


// exports.googleLogin = async (req, res) => {
//   try {
//     const { token } = req.body;

//     console.log("TOKEN RECEIVED:", token);

//     const decoded = await admin.auth().verifyIdToken(token);

//     console.log("DECODED:", decoded); // 👈 IMPORTANT

//     const { uid, email, name } = decoded;

//     let user = await User.findOne({ email });

//     if (!user) {
//       user = await User.create({
//         fullName: name,
//         email,
//         googleId: uid,
//       });
//     }

//     res.json({
//       success: true,
//       message: "Google login successful",
//       user,
//     });

//   } catch (error) {
//     console.error("GOOGLE ERROR:", error); // 👈 REAL ERROR
//     res.status(401).json({
//       success: false,
//       message: error.message, // 👈 actual error bhej
//     });
//   }
// };


exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token missing",
      });
    }

    const decoded = await admin.auth().verifyIdToken(token);

    const { uid, email, name } = decoded;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        googleId: uid,
      });
    }

    res.json({
      success: true,
      message: "Google login successful",
      user,
    });

  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
// =====================================
// 📦 GET ALL USERS
// =====================================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // 🔐 hide password

    res.json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =====================================
// 🔍 GET SINGLE USER
// =====================================
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =====================================
// ✏️ UPDATE USER
// =====================================
exports.updateUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // update fields
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;

    // 🔐 password update (auto hash hoga)
    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: "User updated",
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =====================================
// ❌ DELETE USER
// =====================================
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "User deleted",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// =====================================
// 👤 GET PROFILE (logged in user)
// =====================================
exports.getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// =====================================
// ✏️ UPDATE PROFILE
// =====================================
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;

    if (password) {
      user.password = password; // 🔐 auto hash hoga
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: "Profile updated",
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};