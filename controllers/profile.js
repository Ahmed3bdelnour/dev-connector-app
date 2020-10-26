const { validationResult } = require("express-validator");
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

const createOrUpdateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      status,
      skills,
      company,
      website,
      location,
      bio,
      githubUsername,
      facebook,
      twitter,
      youtube,
      linkedIn,
      instagram,
    } = req.body;

    const profileFields = {};

    profileFields.userId = req.user.id;
    profileFields.status = status;
    profileFields.skills = skills.split(",").map((skill) => skill.trim());

    if (company !== null && company !== undefined)
      profileFields.company = company;

    if (website !== null && website !== undefined)
      profileFields.website = website;

    if (location !== null && location !== undefined)
      profileFields.location = location;

    if (bio !== null && bio !== undefined) profileFields.bio = bio;

    if (githubUsername !== null && githubUsername !== undefined)
      profileFields.githubUsername = githubUsername;

    profileFields.social = {};

    if (facebook !== null && facebook !== undefined)
      profileFields.social.facebook = facebook;

    if (twitter !== null && twitter !== undefined)
      profileFields.social.twitter = twitter;

    if (youtube !== null && youtube !== undefined)
      profileFields.social.youtube = youtube;

    if (linkedIn !== null && linkedIn !== undefined)
      profileFields.social.linkedIn = linkedIn;

    if (instagram !== null && instagram !== undefined)
      profileFields.social.instagram = instagram;

    let profile = await Profile.findOne({ userId: req.user.id });

    if (profile) {
      console.log("update");
      //update
      profile = await Profile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: profileFields },
        { new: true }
      );

      return res.json(profile);
    }

    console.log("add");
    //add
    profile = new Profile(profileFields);

    await profile.save();

    return res.json(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

module.exports = {
  getLoggedInUserProfile,
  createOrUpdateProfile,
};
