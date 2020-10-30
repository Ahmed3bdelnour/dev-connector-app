const Profile = require("../models/Profile");
const User = require("./../models/User");

const deleteUserById = async (req, res) => {
  try {
    console.log("delete entered");

    const userId = req.params.userId;
    const loggedUserId = req.user.id;

    if (userId !== loggedUserId) {
      return res.status(405).json({
        errors: [{ msg: "Not allowed, you can only delete your account" }],
      });
    }

    const user = await User.findOneAndDelete({ _id: userId }).select(
      "-__v -password"
    );

    if (!user) {
      return res.status(404).json({ errors: [{ msg: "User is not found" }] });
    }

    const profile = await Profile.findOneAndDelete({ user: userId });

    return res.json({
      user,
      profile,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

module.exports = {
  deleteUserById,
};
