const express = require("express");
const router  = express.Router();
const upload  = require("../middleware/upload");

const {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const uploadFields = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "instituteLogo", maxCount: 1 },
  { name: "certificateSampleImage", maxCount: 1 },

  // 🔥 NEW (VERY IMPORTANT)
  { name: "topicVideos", maxCount: 100 },
]);

/* ADMIN */
router.post("/admin/course", uploadFields, createCourse);
router.put("/admin/course/:id", uploadFields, updateCourse);
router.delete("/admin/course/:id", deleteCourse);

/* USER */
router.get("/course", getAllCourses);
router.get("/course/:id", getSingleCourse);

module.exports = router;