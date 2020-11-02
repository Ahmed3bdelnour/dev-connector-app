const { validationResult } = require("express-validator");
const got = require("got");

const Profile = require("./../models/Profile");

const getLoggedInUserProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

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

    profileFields.user = req.user.id;
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

    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      console.log("update");
      //update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      ).populate("user", ["name", "avatar"]);

      return res.json(profile);
    }

    console.log("add");
    //add
    profile = new Profile(profileFields);
    await profile.save();

    profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    return res.json(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    return res.json(profiles);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

const getProfileByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    const profile = await Profile.findOne({ user: userId }).populate("user", [
      "name",
      "avatar",
    ]);

    if (!profile) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Profile is not found" }] });
    }

    return res.json(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

const addProfileExperience = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to, //optional
      current, //optional
      description, //optional
    } = req.body;

    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Can not find profile to add experience" }] });
    }

    const newExperience = {};
    newExperience.title = title;
    newExperience.company = company;
    newExperience.location = location;
    newExperience.from = from;
    if (to) newExperience.to = to;
    if (current) newExperience.current = current;
    if (description) newExperience.description = description;

    // update and save in DB
    profile.experiences.push(newExperience);
    await profile.save();

    return res.json(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

const deleteProfileExperience = async (req, res) => {
  try {
    const experienceId = req.params.experienceId;

    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Profile is not found" }] });
    }

    // remove experience
    // const indexToRemove = profile.experiences
    //   .map((exp) => exp._id)
    //   .indexOf(experienceId);

    const indexToRemove = profile.experiences
      .map((exp) => exp._id)
      .indexOf(experienceId);

    if (indexToRemove === -1) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Experience is not found" }] });
    }

    profile.experiences.splice(indexToRemove, 1);

    await profile.save();

    return res.json(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

const addProfileEducation = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldOfStudy,
      from,
      to, //optional
      current, //current
      description, //description
    } = req.body;

    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Profile is not found" }] });
    }

    const newEducation = {};

    newEducation.school = school;
    newEducation.degree = degree;
    newEducation.fieldOfStudy = fieldOfStudy;
    newEducation.from = from;
    if (to !== null && to !== undefined) newEducation.to = to;
    if (current !== null && current !== undefined)
      newEducation.current = current;
    if (description !== null && description !== undefined)
      newEducation.description = description;

    profile.education.push(newEducation);

    await profile.save();

    return res.json(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

const deleteProfileEducation = async (req, res) => {
  try {
    const educationId = req.params.educationId;
    const userId = req.user.id;

    const profile = await Profile.findOne({ user: userId }).populate("user", [
      "name",
      "avatar",
    ]);

    if (!profile) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Profile is not found" }] });
    }

    const indexToRemove = profile.education
      .map((edu) => edu.id)
      .indexOf(educationId);
    profile.education.splice(indexToRemove, 1);

    await profile.save();

    return res.json(profile);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

const getUserRepositories = async (req, res) => {
  try {
    const githubUsername = req.params.username;

    const { body: repositories } = await got.get(
      `https://api.github.com/users/${githubUsername}/repos?type='owner'`,
      {
        responseType: "json",
      }
    );

    return res.json(repositories);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
};

module.exports = {
  getLoggedInUserProfile,
  createOrUpdateProfile,
  getAllProfiles,
  getProfileByUserId,
  addProfileExperience,
  deleteProfileExperience,
  addProfileEducation,
  deleteProfileEducation,
  getUserRepositories,
};
