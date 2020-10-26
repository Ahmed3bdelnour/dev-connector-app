const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const authController = require("./../../controllers/auth");

// post 'api/auth/register'
// public
router.post(
  "/register",
  [
    check("name").notEmpty().withMessage("Name is required"),
    check("email").isEmail().withMessage("Please enter valid email"),
    check("password")
      .isLength({ min: 6, max: 8 })
      .withMessage(
        "Password should have more than 6 and fewer than 8 characters"
      ),
  ],
  authController.registerUser
);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Please enter valid email"),
    check("password")
      .isLength({ min: 6, max: 8 })
      .withMessage(
        "Password should have more than 6 and fewer than 8 characters"
      ),
  ],
  authController.loginUser
);

module.exports = router;
