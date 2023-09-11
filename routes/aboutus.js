const express = require('express');
const debug = require('debug')('webapp:router:index');
const router = express.Router();

/* GET about us page. */
router.get('/', function(req, res, next) {
  res.render('aboutus', { title: 'About our site!' });
});

module.exports = router;
