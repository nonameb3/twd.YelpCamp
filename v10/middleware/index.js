// Middleware gone here
const campgrounds = require("../models/campground");
const comments = require("../models/comment");
const middlewareObj ={};

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

middlewareObj.CheckCampgroundOwner = function(req, res, next) {
    if (req.isAuthenticated()) {
        campgrounds.findById(req.params.id, (err, campground) => {
            if (err) {
                console.log(err);
                res.redirect('back');
            }
            else {
                if (req.user.id == campground.author.id) {
                    next();
                }
                else {
                    res.redirect('back');
                }
            }
        });
    }
    else {
        res.redirect('back');
    }
};

middlewareObj.CheckCommentOwner = function(req, res, next) {
    if (req.isAuthenticated()) {
        comments.findById(req.params.comment_id, (err, comment) => {
            if (err) {
                console.log(err);
                res.redirect('back');
            }
            else {
                if (req.user.id == comment.author.id) {
                    next();
                }
                else {
                    res.redirect('back');
                }
            }
        });
    }
    else {
        res.redirect('back');
    }
};

module.exports = middlewareObj ;