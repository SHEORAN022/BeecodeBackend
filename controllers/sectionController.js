
const Section = require("../models/Section");

/* ================= CREATE ================= */
exports.createSection = async (req, res) => {
  try {
    const { title, courses } = req.body;

    if (!title || !Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title and at least one course required",
      });
    }

    const count = await Section.countDocuments();

    const section = await Section.create({
      title: title.trim(),
      courses,
      order: count + 1,
    });

    const populated = await section.populate("courses", "title");

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET ALL ================= */
exports.getAllSections = async (req, res) => {
  try {
    const sections = await Section.find()
      .populate("courses", "title")
      .sort({ order: 1 });

    res.json({ success: true, data: sections });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET BY COURSE ================= */
exports.getSections = async (req, res) => {
  try {
    const sections = await Section.find({
      courses: req.params.courseId,
    })
      .populate("courses", "title")
      .sort({ order: 1 });

    res.json({ success: true, data: sections });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= UPDATE ================= */
exports.updateSection = async (req, res) => {
  try {
    const { title, courses } = req.body;

    const updateData = {};

    if (title) updateData.title = title.trim();
    if (courses) updateData.courses = courses;

    const section = await Section.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("courses", "title");

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    res.json({ success: true, data: section });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= DELETE ================= */
exports.deleteSection = async (req, res) => {
  try {
    await Section.findByIdAndDelete(req.params.id);

    const sections = await Section.find().sort({ order: 1 });

    const bulkOps = sections.map((s, i) => ({
      updateOne: {
        filter: { _id: s._id },
        update: { $set: { order: i + 1 } },
      },
    }));

    if (bulkOps.length) await Section.bulkWrite(bulkOps);

    res.json({ success: true, message: "Section deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= MOVE ================= */
exports.moveSection = async (req, res) => {
  try {
    const { direction } = req.body;

    if (!["up", "down"].includes(direction)) {
      return res.status(400).json({
        success: false,
        message: "Invalid direction",
      });
    }

    const section = await Section.findById(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    const targetOrder =
      direction === "up" ? section.order - 1 : section.order + 1;

    const swap = await Section.findOne({ order: targetOrder });

    if (!swap) {
      return res.json({
        success: true,
        message: "Already at boundary",
      });
    }

    [section.order, swap.order] = [swap.order, section.order];

    await Promise.all([section.save(), swap.save()]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= REORDER ================= */
exports.reorderSections = async (req, res) => {
  try {
    const { sections } = req.body;

    if (!Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({
        success: false,
        message: "sections array required",
      });
    }

    const bulkOps = sections.map(({ _id, order }) => ({
      updateOne: {
        filter: { _id },
        update: { $set: { order } },
      },
    }));

    await Section.bulkWrite(bulkOps);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
