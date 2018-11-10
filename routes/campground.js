const express = require('express');
const router = express.Router();
const campgrounds = require('../models/campground');
const middleware = require('../middleware/index');
const NodeGeocoder = require('node-geocoder');
 
const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
const geocoder = NodeGeocoder(options);

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

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    campgrounds.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
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

// UPDATE CAMPGROUND Route
router.put("/:id", middleware.CheckCampgroundOwner, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    campgrounds.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
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
