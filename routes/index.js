

const express = require('express');
var router = express.Router();
const passport = require('passport');
var User = require('../models/user');

// =====================================
// ROOT ROUTE
// =====================================

router.get("/", (req, res) => {
	req.flash("success", "Welcome to Yelpcamp!!");
	res.render("landing");
});


// ============================================
// AUTH ROUTES
// ============================================

// Show Register Form
router.get('/register', (req, res) => {
  res.render('register');
});


// Register logic
router.post('/register', (req, res) => {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", err.message);
			console.log(err);
      return res.render('register');
    }
    passport.authenticate('local')(req, req, () => {
			req.flash("success", "Logged you in as " + user.username);
      res.redirect('/campgrounds');
    });
  })
});

// Show Login Form
router.get('/login', (req, res) => {
  res.render('login');
});

// Login logic
router.post('/login', passport.authenticate("local", {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
  }), (req, res) => {
});

// logout route
router.get('/logout', (req, res) => {
  req.logout();
	req.flash("success", "Logged you out!");
  res.redirect('/campgrounds');
});

module.exports = router;
