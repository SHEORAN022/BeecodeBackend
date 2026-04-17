const admin = require("firebase-admin");

// 👇 correct path
const serviceAccount = require("../firebaseServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;