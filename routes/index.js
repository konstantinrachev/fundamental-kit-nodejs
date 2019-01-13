var express = require('express');
var router = express.Router();

var passport = require('passport');

var Option = require('../database/options');
var navigation;

Option.findById('5c3b12a1667d9f2a34e84a5f', function (err, option) {
  navigation = option.value;
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { mainNav: navigation });
});

router.get('/zulu/login', function (req, res, next) {
  res.render('admin/login', {
    meta: {
      title: '', description: ''
    }
  });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/zulu/login',
  failureFlash: true
}))

// router.get('/:contentType/:slug', function(req, res, next) {
// 	res.send(req);
// });

module.exports = router;
