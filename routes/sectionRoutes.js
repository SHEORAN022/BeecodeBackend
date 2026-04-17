const express = require("express");
const router = express.Router();

const {
  createSection,
  getSections,
  getAllSections,
  deleteSection,
  moveSection,
  reorderSections,
  updateSection,
} = require("../controllers/sectionController");

/* CREATE */
router.post("/", createSection);

/* 🔥 ALL SECTIONS FIRST */
router.get("/", getAllSections);

/* DRAG */
router.put("/reorder/all", reorderSections);

/* MOVE */
router.put("/:id/move", moveSection);

/* UPDATE */
router.put("/:id", updateSection);

/* DELETE */
router.delete("/:id", deleteSection);

/* GET BY COURSE (LAST) */
router.get("/:courseId", getSections);

module.exports = router;