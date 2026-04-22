
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

/* GET ALL */
router.get("/", getAllSections);

/* REORDER */
router.put("/reorder/all", reorderSections);

/* MOVE */
router.put("/:id/move", moveSection);

/* UPDATE */
router.put("/:id", updateSection);

/* DELETE */
router.delete("/:id", deleteSection);

/* GET BY COURSE */
router.get("/:courseId", getSections);

module.exports = router;
