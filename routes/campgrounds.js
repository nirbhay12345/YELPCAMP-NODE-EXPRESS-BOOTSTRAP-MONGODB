
// =======================================
// CAMPGROUND ROUTES
// =======================================

const express = require('express');
var router = express.Router();
var Campground = require('../models/campgrounds');
var middleware = require('../middleware');


// INDEX ROUTE
router.get("/campgrounds", (req, res) => {
	// Get all the campgrounds from DB and send here
	Campground.find({}, (err, obj) => {
		if(err){
			console.log(err);
		}else{
			res.render('campgrounds/index', {campgrounds: obj});
		}
	});
});

// NEW ROUTE
router.get("/campgrounds/new", middleware.isLoggedIn, (req, res)=> {
	res.render('campgrounds/new',{currentUser: req.user});
});

// CREATE ROUTE
router.post("/campgrounds", middleware.isLoggedIn, (req, res) => {
		var name = req.body.name; // getting the post data
		var image = req.body.image;// getting the post data
		var description = req.body.description;// getting the post data
		var author = {
			id: req.user._id,
			username: req.user.username
		};
		var newCampground = {name: name, image: image, description:description, author:author };
		// create a new campground and save it to database
		Campground.create(newCampground, (err,obj) => {
			if (err) {
				console.log(err);
			}else {
				req.flash("success", "Congradulations, Campground Added!");
				res.redirect('/campgrounds'); // this will do redirect as a get request
			}
		});
});

// SHOW ROUTE
router.get("/campgrounds/:id", (req, res) => {
	Campground.findById(req.params.id).populate("comments").exec((err, obj) => {
		if (err || !obj) {
			req.flash("error", "Campground not found");
			res.redirect('/campgrounds');
		}else {
			res.render("campgrounds/show", {campground: obj});
		}
	});
});

// EDIT ROUTE
router.get("/campgrounds/:id/edit", middleware.CheckOwner, (req, res) => {
		Campground.findById(req.params.id, (err, obj) => {
					res.render('campgrounds/edit', {campground: obj});
				});
});

// UPDATE ROUTE
router.put('/campgrounds/:id', middleware.CheckOwner, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, obj) => {
		if (err) {
			res.redirect('back');
			console.log(err);
		}else {
			req.flash("success", "Congradulations, Campground Updated!");
			res.redirect('/campgrounds/' + req.params.id);
		}
	});
});


// DELETE ROUTE
router.delete('/campgrounds/:id', middleware.CheckOwner, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if (!err) {
			req.flash("success", "Campground Deleted!");
			res.redirect('/campgrounds');
		}else{
			req.flash("error", "You dont have permission to do that");
			res.redirect("/campgrounds" + req.params.id);
		}
	});
});



module.exports = router;
