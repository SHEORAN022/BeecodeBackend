// const Section = require("../models/Section");

// /* =========================
//    CREATE SECTION
// ========================= */
// exports.createSection = async (req, res) => {
//   try {
//     const { title, course } = req.body;

//     if (!title || !course) {
//       return res.status(400).json({
//         success: false,
//         message: "Title and Course required",
//       });
//     }

//     const count = await Section.countDocuments({ course });

//     const section = await Section.create({
//       title,
//       course,
//       order: count + 1,
//     });

//     res.status(201).json({
//       success: true,
//       data: section,
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* =========================
//    GET ALL SECTIONS ✅ NEW
// ========================= */
// exports.getAllSections = async (req, res) => {
//   try {
//     const sections = await Section.find()
//       .populate("course", "title")
//       .sort({ order: 1 });

//     res.json({
//       success: true,
//       data: sections,
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* =========================
//    GET BY COURSE
// ========================= */
// exports.getSections = async (req, res) => {
//   try {
//     const sections = await Section.find({
//       course: req.params.courseId,
//     }).sort({ order: 1 });

//     res.json({
//       success: true,
//       data: sections,
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* =========================
//    UPDATE
// ========================= */
// exports.updateSection = async (req, res) => {
//   try {
//     const { title } = req.body;

//     if (!title) {
//       return res.status(400).json({
//         success: false,
//         message: "Title required",
//       });
//     }

//     const section = await Section.findByIdAndUpdate(
//       req.params.id,
//       { title },
//       { new: true }
//     );

//     res.json({
//       success: true,
//       data: section,
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* =========================
//    DELETE
// ========================= */
// exports.deleteSection = async (req, res) => {
//   try {
//     const section = await Section.findById(req.params.id);
//     if (!section) return res.status(404).json({ message: "Not found" });

//     const courseId = section.course;

//     await Section.findByIdAndDelete(req.params.id);

//     // reorder
//     const sections = await Section.find({ course: courseId }).sort({ order: 1 });

//     for (let i = 0; i < sections.length; i++) {
//       sections[i].order = i + 1;
//       await sections[i].save();
//     }

//     res.json({ success: true });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* =========================
//    MOVE
// ========================= */
// exports.moveSection = async (req, res) => {
//   try {
//     const { direction } = req.body;

//     const section = await Section.findById(req.params.id);
//     if (!section) return res.status(404).json({ message: "Not found" });

//     let swap;

//     if (direction === "up") {
//       swap = await Section.findOne({
//         course: section.course,
//         order: section.order - 1,
//       });
//     } else {
//       swap = await Section.findOne({
//         course: section.course,
//         order: section.order + 1,
//       });
//     }

//     if (!swap) return res.json({ success: true });

//     const temp = section.order;
//     section.order = swap.order;
//     swap.order = temp;

//     await section.save();
//     await swap.save();

//     res.json({ success: true });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// /* =========================
//    DRAG
// ========================= */
// exports.reorderSections = async (req, res) => {
//   try {
//     const { sections } = req.body;

//     for (const item of sections) {
//       await Section.findByIdAndUpdate(item._id, {
//         order: item.order,
//       });
//     }

//     res.json({ success: true });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const Section = require("../models/Section");

/* ─────────────────────────────────────────
   CREATE SECTION
───────────────────────────────────────── */
exports.createSection = async (req, res) => {
  try {
    const { title, course } = req.body;

    if (!title || !course) {
      return res.status(400).json({
        success: false,
        message: "Title and Course are required",
      });
    }

    const count = await Section.countDocuments({ course });

    const section = await Section.create({
      title: title.trim(),
      course,
      order: count + 1,
    });

    const populated = await section.populate("course", "title");

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────
   GET ALL SECTIONS
───────────────────────────────────────── */
exports.getAllSections = async (req, res) => {
  try {
    const sections = await Section.find()
      .populate("course", "title")
      .sort({ order: 1 });

    res.json({ success: true, data: sections });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────
   GET SECTIONS BY COURSE
───────────────────────────────────────── */
exports.getSections = async (req, res) => {
  try {
    const sections = await Section.find({ course: req.params.courseId })
      .populate("course", "title")
      .sort({ order: 1 });

    res.json({ success: true, data: sections });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────
   UPDATE SECTION TITLE
───────────────────────────────────────── */
exports.updateSection = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const section = await Section.findByIdAndUpdate(
      req.params.id,
      { title: title.trim() },
      { new: true }
    ).populate("course", "title");

    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    res.json({ success: true, data: section });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────
   DELETE SECTION + REORDER REMAINING
───────────────────────────────────────── */
exports.deleteSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    const courseId = section.course;
    await Section.findByIdAndDelete(req.params.id);

    // Fix order of remaining sections in this course
    const remaining = await Section.find({ course: courseId }).sort({ order: 1 });
    const bulkOps = remaining.map((s, i) => ({
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

/* ─────────────────────────────────────────
   MOVE UP / DOWN
───────────────────────────────────────── */
exports.moveSection = async (req, res) => {
  try {
    const { direction } = req.body;

    if (!["up", "down"].includes(direction)) {
      return res.status(400).json({ success: false, message: "Invalid direction" });
    }

    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    const targetOrder = direction === "up" ? section.order - 1 : section.order + 1;

    const swap = await Section.findOne({
      course: section.course,
      order: targetOrder,
    });

    if (!swap) {
      return res.json({ success: true, message: "Already at boundary" });
    }

    // Swap orders
    const temp = section.order;
    section.order = swap.order;
    swap.order = temp;

    await Promise.all([section.save(), swap.save()]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────────────────
   BULK REORDER (drag & drop)
───────────────────────────────────────── */
exports.reorderSections = async (req, res) => {
  try {
    const { sections } = req.body;

    if (!Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({ success: false, message: "sections array required" });
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