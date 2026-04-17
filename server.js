const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // 👈 add
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const courseRoutes = require("./routes/courseRoutes");

// ✅ CORS config (React localhost:3000)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/sections", require("./routes/sectionRoutes"));
app.use("/api", courseRoutes);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));