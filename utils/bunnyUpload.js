const axios = require("axios");

const uploadToBunny = async (file, folder = "general") => {
  try {
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;

    const url = `https://${process.env.BUNNY_STORAGE_REGION}/${process.env.BUNNY_STORAGE_ZONE}/${fileName}`;

    console.log("Uploading to:", url);

    await axios.put(url, file.buffer, {
      headers: {
        AccessKey: process.env.BUNNY_ACCESS_KEY,
        "Content-Type": file.mimetype,
      },
    });

    return `${process.env.BUNNY_CDN_URL}/${fileName}`;

  } catch (error) {
    console.log("BUNNY UPLOAD ERROR:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = uploadToBunny;