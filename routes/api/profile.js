const express = require("express");
const router = express.Router();

const auth = require("./../../middleware/auth");
const profileController = require("./../../controllers/profile");

// get 'api/profile/me'
// private
router.get("/me", auth, profileController.getLoggedInUserProfile);

module.exports = router;
