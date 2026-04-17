// const Course = require("../models/courseModel");
// const Category = require("../models/categoryModel");
// const uploadToBunny = require("../utils/bunnyUpload");

// /* =========================
//    CREATE COURSE
// ========================= */
// exports.createCourse = async (req, res) => {
//   try {
//     const { title, category } = req.body;

//     if (!title || !category) {
//       return res.status(400).json({ success: false, message: "Title and Category are required" });
//     }

//     const categoryExists = await Category.findById(category);
//     if (!categoryExists) {
//       return res.status(404).json({ success: false, message: "Category not found" });
//     }

//     // Parse JSON arrays sent from frontend
//     const highlights = req.body.highlights ? JSON.parse(req.body.highlights) : [];
//     const steps      = req.body.steps      ? JSON.parse(req.body.steps)      : [];
//     const faqs       = req.body.faqs       ? JSON.parse(req.body.faqs)       : [];

//     // Upload files
//     let thumbnailUrl = "", bannerUrl = "", videoUrl = "", instituteLogoUrl = "", certSampleUrl = "";
//     if (req.files?.thumbnail)             thumbnailUrl    = await uploadToBunny(req.files.thumbnail[0],             "courses/thumbnails");
//     if (req.files?.bannerImage)           bannerUrl       = await uploadToBunny(req.files.bannerImage[0],           "courses/banners");
//     if (req.files?.video)                 videoUrl        = await uploadToBunny(req.files.video[0],                 "courses/videos");
//     if (req.files?.instituteLogo)         instituteLogoUrl= await uploadToBunny(req.files.instituteLogo[0],         "courses/logos");
//     if (req.files?.certificateSampleImage)certSampleUrl   = await uploadToBunny(req.files.certificateSampleImage[0],"courses/certificates");

//     const course = await Course.create({
//       title,
//       subtitle:          req.body.subtitle,
//       description:       req.body.description,
//       about:             req.body.about,
//       category,
//       level:             req.body.level,
//       instituteName:     req.body.instituteName,
//       instituteLogo:     instituteLogoUrl,
//       duration:          req.body.duration,
//       emi:               req.body.emi,
//       admissionDeadline: req.body.admissionDeadline || undefined,
//       rating:            req.body.rating       ? Number(req.body.rating)       : 0,
//       totalRatings:      req.body.totalRatings  ? Number(req.body.totalRatings) : 0,
//       totalStudents:     req.body.totalStudents ? Number(req.body.totalStudents): 0,
//       thumbnail:         { url: thumbnailUrl },
//       bannerImage:       { url: bannerUrl },
//       video:             videoUrl,
//       highlights,
//       steps,
//       faqs,
//       certificate: {
//         title:       req.body["certificate.title"],
//         issuedBy:    req.body["certificate.issuedBy"],
//         sampleImage: certSampleUrl,
//       },
//       features: {
//         careerSupport: req.body["features.careerSupport"] === "true",
//         projects:      req.body["features.projects"] ? Number(req.body["features.projects"]) : undefined,
//         alumni:        req.body["features.alumni"]   ? Number(req.body["features.alumni"])   : undefined,
//       },
//       isPublished: req.body.isPublished === "true",
//     });

//     res.status(201).json({ success: true, message: "Course created successfully", data: course });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* =========================
//    GET ALL COURSES
// ========================= */
// exports.getAllCourses = async (req, res) => {
//   try {
//     const courses = await Course.find().populate("category", "name").sort({ createdAt: -1 });
//     res.json({ success: true, data: courses });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* =========================
//    GET SINGLE COURSE
// ========================= */
// exports.getSingleCourse = async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id).populate("category", "name");
//     if (!course) return res.status(404).json({ success: false, message: "Course not found" });
//     res.json({ success: true, data: course });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* =========================
//    UPDATE COURSE
//    - Handles both text fields AND optional file re-uploads
// ========================= */
// exports.updateCourse = async (req, res) => {
//   try {
//     const course = await Course.findById(req.params.id);
//     if (!course) return res.status(404).json({ success: false, message: "Course not found" });

//     // Parse JSON arrays
//     if (req.body.highlights) course.highlights = JSON.parse(req.body.highlights);
//     if (req.body.steps)      course.steps      = JSON.parse(req.body.steps);
//     if (req.body.faqs)       course.faqs       = JSON.parse(req.body.faqs);

//     // Text fields
//     const textFields = ["title","subtitle","description","about","category","level",
//       "instituteName","duration","emi","admissionDeadline"];
//     textFields.forEach(f => { if (req.body[f] !== undefined) course[f] = req.body[f]; });

//     if (req.body.rating       !== undefined) course.rating       = Number(req.body.rating);
//     if (req.body.totalRatings !== undefined) course.totalRatings = Number(req.body.totalRatings);
//     if (req.body.totalStudents!== undefined) course.totalStudents= Number(req.body.totalStudents);
//     if (req.body.isPublished  !== undefined) course.isPublished  = req.body.isPublished === "true";

//     // Certificate
//     if (req.body["certificate.title"])   course.certificate = { ...course.certificate, title:    req.body["certificate.title"] };
//     if (req.body["certificate.issuedBy"])course.certificate = { ...course.certificate, issuedBy: req.body["certificate.issuedBy"] };

//     // Features
//     if (req.body["features.careerSupport"] !== undefined)
//       course.features = { ...course.features, careerSupport: req.body["features.careerSupport"] === "true" };
//     if (req.body["features.projects"])
//       course.features = { ...course.features, projects: Number(req.body["features.projects"]) };
//     if (req.body["features.alumni"])
//       course.features = { ...course.features, alumni: Number(req.body["features.alumni"]) };

//     // Re-upload files if provided
//     if (req.files?.thumbnail)              course.thumbnail   = { url: await uploadToBunny(req.files.thumbnail[0],              "courses/thumbnails") };
//     if (req.files?.bannerImage)            course.bannerImage = { url: await uploadToBunny(req.files.bannerImage[0],            "courses/banners") };
//     if (req.files?.video)                  course.video             = await uploadToBunny(req.files.video[0],                  "courses/videos");
//     if (req.files?.instituteLogo)          course.instituteLogo     = await uploadToBunny(req.files.instituteLogo[0],          "courses/logos");
//     if (req.files?.certificateSampleImage) course.certificate.sampleImage = await uploadToBunny(req.files.certificateSampleImage[0],"courses/certificates");

//     await course.save();
//     res.json({ success: true, message: "Course updated successfully", data: course });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* =========================
//    DELETE COURSE
// ========================= */
// exports.deleteCourse = async (req, res) => {
//   try {
//     await Course.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: "Course deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const Course = require("../models/courseModel");
const Category = require("../models/categoryModel");
const uploadToBunny = require("../utils/bunnyUpload");

/* =========================
   CREATE COURSE
========================= */
exports.createCourse = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Title and Category are required",
      });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 🔥 Parse JSON
    const highlights = req.body.highlights ? JSON.parse(req.body.highlights) : [];
    let steps        = req.body.steps      ? JSON.parse(req.body.steps)      : [];
    const faqs       = req.body.faqs       ? JSON.parse(req.body.faqs)       : [];

    // 🔥 Upload main files
    let thumbnailUrl = "", bannerUrl = "", videoUrl = "", instituteLogoUrl = "", certSampleUrl = "";

    if (req.files?.thumbnail)
      thumbnailUrl = await uploadToBunny(req.files.thumbnail[0], "courses/thumbnails");

    if (req.files?.bannerImage)
      bannerUrl = await uploadToBunny(req.files.bannerImage[0], "courses/banners");

    if (req.files?.video)
      videoUrl = await uploadToBunny(req.files.video[0], "courses/videos");

    if (req.files?.instituteLogo)
      instituteLogoUrl = await uploadToBunny(req.files.instituteLogo[0], "courses/logos");

    if (req.files?.certificateSampleImage)
      certSampleUrl = await uploadToBunny(req.files.certificateSampleImage[0], "courses/certificates");

    // 🔥 TOPIC VIDEOS HANDLE
    if (steps.length && req.files?.topicVideos) {
      let videoIndex = 0;

      for (let i = 0; i < steps.length; i++) {
        if (!steps[i].topics) continue;

        for (let j = 0; j < steps[i].topics.length; j++) {
          const file = req.files.topicVideos[videoIndex];

          if (file) {
            const url = await uploadToBunny(file, "courses/topics");
            steps[i].topics[j].video = url;
          }

          videoIndex++;
        }
      }
    }

    const course = await Course.create({
      title,
      subtitle: req.body.subtitle,
      description: req.body.description,
      about: req.body.about,
      category,
      level: req.body.level,

      instituteName: req.body.instituteName,
      instituteLogo: instituteLogoUrl,

      duration: req.body.duration,
      emi: req.body.emi,
      admissionDeadline: req.body.admissionDeadline || undefined,

      rating: req.body.rating ? Number(req.body.rating) : 0,
      totalRatings: req.body.totalRatings ? Number(req.body.totalRatings) : 0,
      totalStudents: req.body.totalStudents ? Number(req.body.totalStudents) : 0,

      thumbnail: { url: thumbnailUrl },
      bannerImage: { url: bannerUrl },
      video: videoUrl,

      highlights,
      steps, // 🔥 topics included
      faqs,

      certificate: {
        title: req.body["certificate.title"],
        issuedBy: req.body["certificate.issuedBy"],
        sampleImage: certSampleUrl,
      },

      features: {
        careerSupport: req.body["features.careerSupport"] === "true",
        projects: req.body["features.projects"]
          ? Number(req.body["features.projects"])
          : undefined,
        alumni: req.body["features.alumni"]
          ? Number(req.body["features.alumni"])
          : undefined,
      },

      isPublished: req.body.isPublished === "true",
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });

  } catch (error) {
    console.log("CREATE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   GET ALL COURSES
========================= */
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: courses });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   GET SINGLE COURSE
========================= */
exports.getSingleCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("category", "name");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({ success: true, data: course });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   UPDATE COURSE
========================= */
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 🔥 Parse JSON
    if (req.body.highlights) course.highlights = JSON.parse(req.body.highlights);
    if (req.body.faqs)       course.faqs       = JSON.parse(req.body.faqs);

    let steps = req.body.steps ? JSON.parse(req.body.steps) : course.steps;

    // 🔥 topic videos update
    if (steps.length && req.files?.topicVideos) {
      let videoIndex = 0;

      for (let i = 0; i < steps.length; i++) {
        if (!steps[i].topics) continue;

        for (let j = 0; j < steps[i].topics.length; j++) {
          const file = req.files.topicVideos[videoIndex];

          if (file) {
            const url = await uploadToBunny(file, "courses/topics");
            steps[i].topics[j].video = url;
          }

          videoIndex++;
        }
      }
    }

    course.steps = steps;

    // 🔥 text fields
    const fields = [
      "title","subtitle","description","about",
      "category","level","instituteName",
      "duration","emi","admissionDeadline"
    ];

    fields.forEach(f => {
      if (req.body[f] !== undefined) course[f] = req.body[f];
    });

    if (req.body.isPublished !== undefined)
      course.isPublished = req.body.isPublished === "true";

    // 🔥 files
    if (req.files?.thumbnail)
      course.thumbnail = { url: await uploadToBunny(req.files.thumbnail[0], "courses/thumbnails") };

    if (req.files?.bannerImage)
      course.bannerImage = { url: await uploadToBunny(req.files.bannerImage[0], "courses/banners") };

    if (req.files?.video)
      course.video = await uploadToBunny(req.files.video[0], "courses/videos");

    await course.save();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });

  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   DELETE COURSE
========================= */
exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Course deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};