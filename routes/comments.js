
// ====================================================
// COMMENTS ROUTES
// ====================================================

const express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campgrounds');
var Comment = require('../models/comment');
var middleware = require('../middleware');

// NEW ROUTE
router.get('/comments/new', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, obj) => {
    if (!err) {
      res.render('comments/new', {campground: obj});
    }else {
      req.flash("error", "Something went wrong! Please Try Later");
      res.redirect('back');
    }
  });
});

// CREATE ROUTE
router.post('/comments', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, obj) => {
    if (err) {
      console.log(err);
      res.redirect('/campgrounds');
    }else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash("error", "Something went wrong. Please Try Later");
          res.redirect('back');
        }else {
          comment.author.id = req.user.id;
          comment.author.username = req.user.username;
          comment.save();
          obj.comments.push(comment);
          obj.save();
          req.flash("success", "Comment Added");
          res.redirect('/campgrounds/' + obj._id);
        }
      });
    }
  });
});

//  EDIT ROUTE
router.get('/comments/:comment_id/edit', middleware.CommentOwner, (req, res) => {
  Campground.findById(req.params.id, (err, Fcampground) => {
    if(err || !Fcampground){
      req.flash("error", "Campground not found!");
    }
    Comment.findById(req.params.comment_id, (err, obj) => {
      if (err) {
        res.redirect('back');
      }else {
        res.render('comments/edit', {campground_id:req.params.id, comment:obj});
      }
    });
  });
});

// UPDATE ROUTE
router.put('/comments/:comment_id', middleware.CommentOwner, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, obj) => {
    if (err) {
      res.redirect('back');
    }else {
      req.flash("success", "Comment Updated")
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

// DELETE ROUTE
router.delete('/comments/:comment_id', middleware.CommentOwner, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (!err) {
      req.flash("success", "Comment Deleted!");
      res.redirect('/campgrounds/' + req.params.id);
    }else {
      res.redirect('back');
    }
  })
});

module.exports = router;
