// Middleware gone here
const campgrounds = require("../models/campground");
const comments = require("../models/comment");
const middlewareObj ={};

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error','Please login first!!');
    res.redirect('back');
};

middlewareObj.CheckCampgroundOwner = function(req, res, next) {
    if (req.isAuthenticated()) {
        campgrounds.findById(req.params.id, (err, campground) => {
            if (err) {
                console.log(err);
                req.flash('error','Campground not found!!');
                res.redirect('back');
            }
            else {
                if (req.user.id == campground.author.id) {
                    next();
                }
                else {
                    req.flash('error',"You don't have permission to do that!!");
                    res.redirect('back');
                }
            }
        });
    }
    else {
        req.flash('error','You need to be logged to do that!!');
        res.redirect('back');
    }
};

middlewareObj.CheckCommentOwner = function(req, res, next) {
    if (req.isAuthenticated()) {
        comments.findById(req.params.comment_id, (err, comment) => {
            if (err) {
                console.log(err);
                req.flash('error','Comment not found!!');
                res.redirect('back');
            }
            else {
                if (req.user.id == comment.author.id) {
                    next();
                }
                else {
                    req.flash('error',"You don't have permission to do that!!");
                    res.redirect('back');
                }
            }
        });
    }
    else {
        req.flash('error','You need to be logged to do that!!');
        res.redirect('back');
    }
};

module.exports = middlewareObj ;