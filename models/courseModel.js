// const mongoose = require("mongoose");

// /* =========================
//    COURSE STEP (SYLLABUS)
// ========================= */
// const courseStepSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   duration: { type: String },
//   isSpecialization: { type: Boolean, default: false }
// });

// /* =========================
//    FAQ SCHEMA
// ========================= */
// const faqSchema = new mongoose.Schema({
//   question: String,
//   answer: String
// });

// /* =========================
//    MAIN COURSE SCHEMA
// ========================= */
// const courseSchema = new mongoose.Schema(
//   {
//     /* BASIC INFO */
//     title: { type: String, required: true },
//     subtitle: String,
//     description: String,

//     /* IMAGE */
//     thumbnail: {
//       url: String,
//       public_id: String,
//     },

//     bannerImage: {
//       url: String,
//       public_id: String,
//     },

//     /* INSTITUTE */
//     instituteName: String,
//     instituteLogo: String,

//     /* 🔥 CATEGORY (UPDATED) */
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",   // 👈 ye important hai
//       required: true
//     },

//     /* LEVEL */
//     level: {
//       type: String,
//       enum: ["Beginner", "Intermediate", "Advanced"],
//     },

//     /* COURSE DETAILS */
//     duration: String,
//     emi: String,
//     admissionDeadline: Date,

//     /* RATINGS */
//     rating: { type: Number, default: 0 },
//     totalRatings: { type: Number, default: 0 },
//     totalStudents: { type: Number, default: 0 },

//     /* ABOUT */
//     about: String,

//     /* HIGHLIGHTS */
//     highlights: [String],

//     /* SYLLABUS */
//     steps: [courseStepSchema],

//     /* CERTIFICATE */
//     certificate: {
//       title: String,
//       issuedBy: String,
//       sampleImage: String,
//     },

//     /* FAQ */
//     faqs: [faqSchema],

//     /* FEATURES */
//     features: {
//       careerSupport: { type: Boolean, default: false },
//       projects: Number,
//       alumni: Number,
//     },

//     /* STATUS */
//     isPublished: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Course", courseSchema);

const mongoose = require("mongoose");

/* =========================
   TOPIC (LECTURE)
========================= */
const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  video: String, // Bunny CDN URL

  duration: String, // optional (video length)
  isPreview: {
    type: Boolean,
    default: false, // free preview
  },
});

/* =========================
   COURSE STEP (SYLLABUS / MODULE)
========================= */
const courseStepSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  duration: String, // OLD
  isSpecialization: {
    type: Boolean,
    default: false,
  },

  // 🔥 NEW (LECTURES INSIDE MODULE)
  topics: [topicSchema],
});

/* =========================
   FAQ SCHEMA
========================= */
const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

/* =========================
   MAIN COURSE SCHEMA
========================= */
const courseSchema = new mongoose.Schema(
  {
    /* BASIC INFO */
    title: { type: String, required: true },
    subtitle: String,
    description: String,

    /* IMAGE */
    thumbnail: {
      url: String,
      public_id: String,
    },

    bannerImage: {
      url: String,
      public_id: String,
    },

    /* 🔥 MAIN COURSE VIDEO (optional) */
    video: String,

    /* INSTITUTE */
    instituteName: String,
    instituteLogo: String,

    /* CATEGORY */
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    /* LEVEL */
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },

    /* COURSE DETAILS */
    duration: String,
    emi: String,
    admissionDeadline: Date,

    /* 🔥 PRICING (IMPORTANT FOR BILLING) */
    price: {
      type: Number,
      default: 0,
    },

    discountPrice: {
      type: Number,
      default: 0,
    },

    isFree: {
      type: Boolean,
      default: false,
    },

    /* RATINGS */
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },

    /* ABOUT */
    about: String,

    /* HIGHLIGHTS */
    highlights: [String],

    /* SYLLABUS */
    steps: [courseStepSchema],

    /* CERTIFICATE */
    certificate: {
      title: String,
      issuedBy: String,
      sampleImage: String,
    },

    /* FAQ */
    faqs: [faqSchema],

    /* FEATURES */
    features: {
      careerSupport: { type: Boolean, default: false },
      projects: Number,
      alumni: Number,
    },

    /* 🔥 ACCESS CONTROL */
    isPublished: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: true,
    },

    /* 🔥 CREATED BY (ADMIN/VENDOR) */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);