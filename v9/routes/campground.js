const express = require('express');
const router = express.Router();
const campgrounds = require('../models/campground');

//================
//      ROUTE
//================

// INDEX Route
router.get('/', (req, res) => {
    campgrounds.find((err, listcampground) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campground/index", { campgrounds: listcampground , currentUser:req.user});
        }
    });
});

// NEW Route
router.get('/new', (req, res) => {
    res.render("campground/new");
});

// CREATE Route
router.post('/', isLoggedIn, (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCampground = {
        name,
        image,
        description: desc,
        author: author
    };

    campgrounds.create(newCampground, (err, newCampground) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/campgrounds');
        }
    });
});

// SHOW Route - show more infomation.
router.get('/:id', (req, res) => {
    const _id = req.params.id;
    // campgroundList.findById(_id).populate("comments").exec(function(err, result) {
    campgrounds.findOne({_id:_id}).populate("comments").exec(function(err, result) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(result);
            res.render("campground/show", { campground: result });
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