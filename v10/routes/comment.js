const express = require('express');
const router = express.Router({mergeParams:true});
const campgrounds = require('../models/campground');
const comments = require('../models/comment');

//=======================
//    COMMENT ROUTE
//=======================

// NEW Route
router.get("/new",isLoggedIn, (req,res)=>{
    campgrounds.findOne({_id:req.params.id},(err,campground)=>{
        if(err){
            console.log(err);
        }else{
            //console.log(campground);
            res.render("comment/new",{campground:campground});
        }
    });
});

// CREATE Route
router.post("/",isLoggedIn,(req,res)=>{
    campgrounds.findOne({_id:req.params.id},(err,campground)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            comments.create(req.body.comment,(err,comment)=>{
                if(err){
                    console.log(err);
                }else{
                    // add id and username to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

// Edit Route
router.get('/:comment_id/edit', CheckCommentOwner,(req,res)=>{
    comments.findById(req.params.comment_id,(err,comment)=>{
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else{
            res.render('comment/edit',{campground_id:req.params.id,comment:comment});
        }
    });
});

// Update Route
router.put('/:comment_id/edit', CheckCommentOwner,(req,res)=>{
    comments.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,comment)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// Destroy Route
router.delete('/:comment_id', CheckCommentOwner,(req,res)=>{
    comments.findByIdAndRemove(req.params.comment_id,(err,comment)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// Check Auth meddleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function CheckCommentOwner(req, res, next) {
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
}

module.exports = router;