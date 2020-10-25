const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res
      .status(401)
      .json({ errors: [{ msg: 'unauthorized request, no token found' }] });
  }

  try {
    const decodedToken = jwt.verify(token, config.get('tokenSecret'));
    req.user = decodedToken.user;
    next();
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ errors: [{ msg: 'unauthorized request, token is not valid' }] });
  }
};
