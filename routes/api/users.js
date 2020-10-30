const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const usersController = require("./../../controllers/users");

// get 'api/users'
// public
router.get("/", (req, res) => {
  return res.send("users route");
});

// delete '/api/users/:userId'
// private

router.delete("/:userId", auth, usersController.deleteUserById);

module.exports = router;
