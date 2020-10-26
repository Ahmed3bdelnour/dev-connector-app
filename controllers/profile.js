const Profile = require("./../models/Profile");

const getLoggedInUserProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      userId: req.user.id,
    }).populate("userId", ["name", "avatar"]);

    if (!profile) {
      return res.status(404).json({ errors: [{ msg: "Profile not found" }] });
    }

    return res.json(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

module.exports = {
  getLoggedInUserProfile,
};
