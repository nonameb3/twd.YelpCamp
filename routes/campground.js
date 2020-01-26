const express = require('express');
const router = express.Router();
const campgrounds = require('../models/campground');
const comments = require('../models/comment');
const middleware = require('../middleware/index');
const NodeGeocoder = require('node-geocoder');
const Review = require("../models/review");
 
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
router.get('/old', (req, res) => {
    campgrounds.find((err, listcampground) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campground/index", { campgrounds: listcampground, currentUser: req.user, page:'campgrounds' });
        }
    });
});

router.get("/", (req, res)=> {
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    campgrounds.find({}).sort('-createDate').skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
        campgrounds.countDocuments((err,count)=>{
        	if(err) {
        		console.log(err);
        	}
        	else{
        		res.render("campground/index", {
                    campgrounds: allCampgrounds,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage),
                    page:'campgrounds'
                });
        	}
        });
    });
});

// NEW Route
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render("campground/new");
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, (req, res) => {
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
  var location = req.body.location;

  geocoder.geocode(location, (err, data) => {
    if (err || !data.length) {
      console.log(err);
      req.flash('error', 'Error: ' + err.message);
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    campgrounds.create(newCampground, (err, newlyCreated)=> {
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
    campgrounds.findById(req.params.id).populate("comments").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campground/show", {campground: foundCampground});
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
router.put("/:id", middleware.CheckCampgroundOwner, (req, res) => {
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
    campgrounds.findById(req.params.id, function (err, campground) {
        if (err) {
          console.log(err);
            res.redirect("/campgrounds");
        } else {
            // deletes all comments associated with the campground
            comments.remove({"_id": {$in: campground.comments}}, function (err) {
                if (err) {
                    console.log(err);
                    return res.redirect("/campgrounds");
                }
                // deletes all reviews associated with the campground
                Review.remove({"_id": {$in: campground.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/campgrounds");
                    }
                    //  delete the campground
                    campground.remove();
                    req.flash("success", "Campground deleted successfully!");
                    res.redirect("/campgrounds");
                });
            });
        }
    });
});

module.exports = router;
