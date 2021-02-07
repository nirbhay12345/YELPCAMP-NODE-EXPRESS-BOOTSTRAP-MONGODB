const express = require('express');
const	app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const expreSession = require('express-session');
const localStrategy = require('passport-local');
const methodOveride = require('method-override');
const flash = require('connect-flash');
var Campground = require('./models/campgrounds');
var Comment = require('./models/comment');
var User = require('./models/user');
// var seedDB = require('./seeds');
var campgroundRoutes = require('./routes/campgrounds');
var commentsRoutes = require('./routes/comments');
var indexRoutes = require('./routes/index');

// seedDB();
// DATABASE CONNECT
mongoose.connect('mongodb://localhost:27017/yelpcamp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// APP CONFIG
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOveride("_method"));
app.use(flash());

// PASSPORT CONFIG
app.use(expreSession({
  secret: "this is yelpcamp! and i am nirbhay a web dev",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Routes CONFIG
app.use(campgroundRoutes);
app.use("/campgrounds/:id", commentsRoutes);
app.use(indexRoutes);


// APP ROUTE
app.listen(3000, (req, res) => {
  console.log('Server is running....');
});
