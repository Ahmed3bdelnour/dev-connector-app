const { validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./../models/User');

const registerUser = async (req, res) => {
  try {
    console.log('register request body: ', req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: 'user already exists' }] });
    }

    // create user avatar
    const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });

    user = new User({
      name,
      email,
      password,
      avatar,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const tokenPayload = {
      user: {
        id: user._id, //user.id
      },
    };

    const tokenSecret = config.get('tokenSecret');

    const token = jwt.sign(tokenPayload, tokenSecret, {
      expiresIn: 3600,
    });

    return res.json({ token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errors: [{ msg: 'server error' }] });
  }
};

module.exports = {
  registerUser,
};
