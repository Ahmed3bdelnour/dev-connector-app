const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const auth = require("./../../middleware/auth");
const profileController = require("./../../controllers/profile");

// get 'api/profile/me'
// private
router.get("/me", auth, profileController.getLoggedInUserProfile);

// post 'api/profile'
// private
router.post(
  "/",
  [
    auth,
    check("status").notEmpty().withMessage("Status is required"),
    check("skills").notEmpty().withMessage("Skills are required"),
  ],
  profileController.createOrUpdateProfile
);

module.exports = router;
