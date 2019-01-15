var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

var passport = require('passport');

var Content = require('../database/content');
var Option = require('../database/options');
var Media = require('../database/media');
var Page = require('../database/pages');
var navigation;

Option.findById('5c3b12a1667d9f2a34e84a5f', function (err, option) {
  navigation = option.value;
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { mainNav: navigation });
});

router.get('/page/:slug', function (req, res, next) {
  Page.find({slug: req.params.slug}, function (err, page) {
    res.render('page', {
      mainNav: navigation,
      el: page
    })
  });
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/zulu/pages',
    failureRedirect: '/zulu/login',
    failureFlash: true,
    session: true
  })
);

router.get('/zulu/login', function (req, res, next) {
  res.render('admin/login', {
    csrf: req.csrfToken(),
    meta: {
      title: '', description: ''
    }
  });
});

router.get('/media/:id', async (req, res) => {
  try
  {
    Media.findById(req.params.id, (err, result) => {
      if (err) return res.status(500).send(err);

      res.setHeader('Content-Type', result.mimetype);
      fs.createReadStream(path.join('uploads', result.name)).pipe(res);
    });
  }
  catch (err)
  {
    res.status(404).send(err);
  }
});

// router.get('/:content/:slug', function (req, res, next) {
//   Content.find({slug: req.params.slug}, function (err, result) {
//     res.render('page', {
//       el: result
//     });
//   });
// });

// router.get('/:contentType/:slug', function(req, res, next) {
// 	res.send(req);
// });

module.exports = router;
