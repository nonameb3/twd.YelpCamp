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

// Check Auth meddleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;