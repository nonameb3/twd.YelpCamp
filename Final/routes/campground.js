const express = require('express');
const router = express.Router();
const campgrounds = require('../models/campground');
const middleware = require('../middleware/index');

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
            res.render("campground/index", { campgrounds: listcampground, currentUser: req.user });
        }
    });
});

// NEW Route
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render("campground/new");
});

// CREATE Route
router.post('/', middleware.isLoggedIn, (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const price = req.body.price;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCampground = {
        name,
        image,
        description: desc,
        author: author,
        price: price
    };

    campgrounds.create(newCampground, (err, newCampground) => {
        if (err) {
            console.log(err);
        }
        else {
            req.flash('success','Campground is created!!');
            res.redirect('/campgrounds');
        }
    });
});

// SHOW Route - show more infomation.
router.get('/:id', (req, res) => {
    const _id = req.params.id;
    // campgroundList.findById(_id).populate("comments").exec(function(err, result) {
    campgrounds.findOne({ _id: _id }).populate("comments").exec(function(err, result) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(result);
            res.render("campground/show", { campground: result });
        }
    });
});

// EDIT Route
router.get('/:id/edit', middleware.CheckCampgroundOwner, (req, res) => {
    campgrounds.findOne({ _id: req.params.id }, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        }
        else {
            res.render('campground/edit', { campground: campground });
        }
    });
});

// UPDATE Route
router.put('/:id', middleware.CheckCampgroundOwner, (req, res) => {
    campgrounds.findOne({ _id: req.params.id }, (err, campground) => {
        if (err) {
            console.log(err);
        }
        else {
            campground.set(req.body.campground);
            campground.save();
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

// DESTROY Route
router.delete('/:id', middleware.CheckCampgroundOwner, (req, res) => {
    campgrounds.findByIdAndRemove(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect('/campgrounds');
        }
        else {
            req.flash('success','Campground is destroyed!!');
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;
