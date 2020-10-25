const express = require('express');
const router = express.Router();

// get 'api/users'
// public
router.get('/', (req, res) => {
  return res.send('users route');
});

module.exports = router;
