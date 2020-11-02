const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const auth = require("./../../middleware/auth");
const profileController = require("./../../controllers/profile");
const profile = require("./../../controllers/profile");

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

// get 'api/profile'
// private
router.get("/", [auth], profileController.getAllProfiles);

// get 'api/profile/:userId'
// private
router.get("/:userId", [auth], profileController.getProfileByUserId);

// put 'api/profile/experience'
// private

router.put(
  "/experience",
  [
    auth,
    [
      check("title").notEmpty().withMessage("Title is required"),
      check("company").notEmpty().withMessage("Company is required"),
      check("location").notEmpty().withMessage("Location is required"),
      check("from").notEmpty().withMessage("from is required"),
    ],
  ],
  profileController.addProfileExperience
);

// delete 'api/profile/experience/:experienceId'
// private

router.delete(
  "/experience/:experienceId",
  [auth],
  profileController.deleteProfileExperience
);

// put 'api/profile/education'
// private

router.put(
  "/education",
  [
    auth,
    [
      check("school").notEmpty().withMessage("School is required"),
      check("degree").notEmpty().withMessage("Degree is required"),
      check("fieldOfStudy").notEmpty().withMessage("FieldOfStudy is required"),
      check("from").notEmpty().withMessage("From date is required"),
    ],
  ],
  profileController.addProfileEducation
);

// delete 'api/profile/education/:educationId'
//private
router.delete(
  "/education/:educationId",
  [auth],
  profileController.deleteProfileEducation
);

// get 'api/profile/github/:username'
//private

router.get("/github/:username", [auth], profileController.getUserRepositories);

module.exports = router;
