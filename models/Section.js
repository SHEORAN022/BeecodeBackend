// const mongoose = require("mongoose");

// const sectionSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },

//     course: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Course",
//       required: true,
//     },

//     order: {
//       type: Number,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Section", sectionSchema);


const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Section title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    // ✅ MULTIPLE COURSES (proper validation + no duplicates)
    courses: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        }
      ],
      required: true,
      validate: {
        validator: function (val) {
          return val.length > 0;
        },
        message: "At least one course is required",
      },
      set: (arr) => [...new Set(arr.map(String))], // remove duplicates
    },

    // ✅ ORDER (drag/drop friendly)
    order: {
      type: Number,
      default: 0,
      index: true,
    },

    // ✅ ACTIVE STATUS
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* 🔥 COMPOUND INDEX (fast filtering + sorting) */
sectionSchema.index({ courses: 1, order: 1 });

/* 🔥 SAFE JSON RESPONSE (remove __v) */
sectionSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Section", sectionSchema);
