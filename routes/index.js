const express = require('express');
const debug = require('debug')('webapp:router:index');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Just Home!' });
});

module.exports = router;
