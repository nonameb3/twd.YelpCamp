// Middleware gone here
const campground = require("../models/campground");
const comment = require("../models/comment");
const review = require("../models/review");
const middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please login first!!');
    res.redirect('/login');
};

middlewareObj.CheckCampgroundOwner = function(req, res, next) {
    if (req.isAuthenticated()) {
        campground.findById(req.params.id, (err, campground) => {
            if (err) {
                console.log(err);
                req.flash('error', 'Campground not found!!');
                res.redirect('back');
            }
            else {
                if ((req.user.id == campground.author.id) || req.user.admin) {
                    next();
                }
                else {
                    req.flash('error', "You don't have permission to do that!!");
                    res.redirect('back');
                }
            }
        });
    }
    else {
        req.flash('error', 'You need to be logged to do that!!');
        res.redirect('/login');
    }
};

middlewareObj.CheckCommentOwner = function(req, res, next) {
    if (req.isAuthenticated()) {
        comment.findById(req.params.comment_id, (err, comment) => {
            if (err) {
                console.log(err);
                req.flash('error', 'Comment not found!!');
                res.redirect('back');
            }
            else {
                if ((req.user.id == comment.author.id) || req.user.admin) {
                    next();
                }
                else {
                    req.flash('error', "You don't have permission to do that!!");
                    res.redirect('back');
                }
            }
        });
    }
    else {
        req.flash('error', 'You need to be logged to do that!!');
        res.redirect('/login');
    }
};

middlewareObj.checkReviewOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        review.findById(req.params.review_id, function(err, foundReview) {
            if (err || !foundReview) {
                console.log(err);
                req.flash('error', 'Review not found!!');
                res.redirect("back");
            }
            else {
                if (foundReview.author.id.equals(req.user._id) || req.user.admin) {
                    next();
                }
                else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkReviewExistence = function(req, res, next) {
    if (req.isAuthenticated()) {
        campground.findById(req.params.id).populate("reviews").exec(function(err, foundCampground) {
            if (err || !foundCampground) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            }
            else {
                // check if req.user._id exists in foundCampground.reviews
                var foundUserReview = foundCampground.reviews.some(function(review) {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review.");
                    return res.redirect("back");
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    }
    else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};

module.exports = middlewareObj;
