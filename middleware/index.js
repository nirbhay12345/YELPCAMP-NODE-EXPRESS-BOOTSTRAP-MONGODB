// MIDDLEWARE GOES HERE

var Campground = require('../models/campgrounds');
var Comment = require('../models/comment');

var middlewareObj = {};

middlewareObj.CheckOwner = function (req, res, next){
	if(req.isAuthenticated()){//checks if the user is present
		Campground.findById(req.params.id, (err, obj) => {//finds the campground
			if (!err && !!obj) {
				if (obj.author.id.equals(req.user._id)) {//if the user id == campground.author.id
					next(); //then next
				}else {
					req.flash("error", "You don't have permission to do that");
					res.redirect('/campgrounds/' + req.params.id); //or else back
				}
			}else {
				req.flash("error", "Could not find Campground");
				res.redirect('back');//if the campground is not found
			}
		});
	}else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect('/login');//if the user is not found
	}
}

middlewareObj.CommentOwner = function (req, res, next){
	if(req.isAuthenticated()){//checks if the user is present
		Comment.findById(req.params.comment_id, (err, obj) => {//finds the Comment
			if (!err && !!obj) {
				if (obj.author.id.equals(req.user._id)) {//if the user id == comment.author.id
					next(); //then next
				}else {
					req.flash("error", "You don't have permission to do that");
					res.redirect('back'); //or else back
				}
			}else {
				req.flash("error", "Could not find Comment");
				res.redirect('back');//if the comment is not found
			}
		});
	}else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect('/login');//if the user is not found
	}
}

middlewareObj.isLoggedIn = function (req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
	req.flash("error", "You need to be logged in to do that!");
  res.redirect('/login');
}



module.exports = middlewareObj;
