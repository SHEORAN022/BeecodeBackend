// const Admin = require("../models/adminModel");
// const jwt = require("jsonwebtoken");

// // 🔐 Generate Token
// const generateToken = (id) => {
//   return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
// };

// // ✅ Admin Register (optional)
// exports.registerAdmin = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const adminExists = await Admin.findOne({ email });
//     if (adminExists) {
//       return res.status(400).json({ message: "Admin already exists" });
//     }

//     const admin = await Admin.create({ name, email, password });

//     res.status(201).json({
//       success: true,
//       _id: admin._id,
//       name: admin.name,
//       email: admin.email,
//       token: generateToken(admin._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // 🔑 Admin Login
// exports.loginAdmin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const admin = await Admin.findOne({ email });

//     if (admin && (await admin.matchPassword(password))) {
//       res.json({
//         success: true,
//         _id: admin._id,
//         name: admin.name,
//         email: admin.email,
//         token: generateToken(admin._id),
//       });
//     } else {
//       res.status(401).json({ message: "Invalid email or password" });
//     }

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };





const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");

// 🔐 Generate Token
const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      type: "admin", // 🔥 important (middleware ke liye)
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};



// ✅ Admin Register
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔍 check existing admin
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    // 🆕 create admin
    const admin = await Admin.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin),
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// 🔑 Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 find admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Admin not found",
      });
    }

    // 🔐 check password
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // ✅ success response
    res.json({
      success: true,
      message: "Login successful",
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin),
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// 👤 Get Logged In Admin Profile
exports.getAdminProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};