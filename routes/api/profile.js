const express = require('express');
const router = express.Router();

// method get
// url 'api/profile'
// public
router.get('/', (req, res) => {
    res.send('profile route');
})

module.exports = router;