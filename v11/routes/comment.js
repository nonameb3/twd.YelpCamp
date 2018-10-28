const express = require('express');
const router = express.Router({mergeParams:true});
const campgrounds = require('../models/campground');
const comments = require('../models/comment');
const middleware = require('../middleware/index');

//=======================
//    COMMENT ROUTE
//=======================

// NEW Route
router.get("/new", middleware.isLoggedIn, (req,res)=>{
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
router.post("/", middleware.isLoggedIn,(req,res)=>{
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
                    req.flash('success','Comment is created!!');
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

// EDIT Route
router.get('/:comment_id/edit', middleware.CheckCommentOwner,(req,res)=>{
    comments.findById(req.params.comment_id,(err,comment)=>{
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else{
            res.render('comment/edit',{campground_id:req.params.id,comment:comment});
        }
    });
});

// UPDATE Route
router.put('/:comment_id/edit', middleware.CheckCommentOwner,(req,res)=>{
    comments.findByIdAndUpdate(req.params.comment_id,req.body.comment,(err,comment)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DESTROY Route
router.delete('/:comment_id', middleware.CheckCommentOwner,(req,res)=>{
    comments.findByIdAndRemove(req.params.comment_id,(err,comment)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            req.flash('success','Comment is deleted!!');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

module.exports = router;