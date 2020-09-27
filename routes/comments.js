var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");


//=============================
// COMMENTS ROUTES
//=============================
//Comments New
router.get("/new", middleware.isLoggedIn, function(req,res){
	//find campground by id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else{
			res.render("comments/new", {campground:campground});
		}
	})
});

//Comments Create
router.post("/", middleware.isLoggedIn, function(req,res){
	//lookup campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash("error", "Something went wrong");
			res.redirect("/campgrounds");
		} else{
			//create a new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//connect comment to campground
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment")
					//redirect to show page
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	})
});


//EDIT COMMENT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "No campground found");
			return res.redirect("back");
		}
	});
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else{
			//req.params.id is the id of the campground. comments has it's own id
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});


//UPDATE COMMENT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else{
			//req.params.id is the id of the campground NOT comment
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})


//DESTROY COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else{
			req.flash("success", "Comment has been deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});




module.exports = router;