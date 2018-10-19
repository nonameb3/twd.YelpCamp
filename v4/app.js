// Add System
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Add Models
const campgroundList = require('./models/campground');
const Comments = require("./models/comment");
const seedDB = require('./seeds');
seedDB();

// Set MongoDB
mongoose.connect("mongodb://localhost:27017/yelp_camp_v4",{ useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// campgroundList.create({
//   name: 'camp1',
//   image: 'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
//   description : 'bahbah'
// },(err,campground)=>{
//   if(err){
//     console.log("error add data to mongodb")
//   }else{
//     console.log("add data \n"+campground)
//   }
// })

app.get('/', (req, res) => {
    res.render('landing');
});

// INDEX Route
app.get('/campgrounds', (req, res) => {
    campgroundList.find((err, listcampground) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campground/index", { campgrounds: listcampground });
        }
    });
});

// NEW Route
app.get('/campgrounds/new', (req, res) => {
    res.render("campground/new");
});

// CREATE Route
app.post('/campgrounds', (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const newCampground = {
        name,
        image,
        description: desc
    };

    campgroundList.create(newCampground, (err, newCampground) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/campgrounds');
        }
    });
});

// SHOW Route - show more infomation.
app.get('/campgrounds/:id', (req, res) => {
    const _id = req.params.id;
    // campgroundList.findById(_id).populate("comments").exec(function(err, result) {
    campgroundList.findOne({_id:_id}).populate("comments").exec(function(err, result) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(result);
            res.render("campground/show", { campground: result });
        }
    });
});

//=======================
//    COMMENT ROUTE
//=======================

// NEW Route
app.get("/campgrounds/:id/comments/new", (req,res)=>{
    campgroundList.findOne({_id:req.params.id},(err,campground)=>{
        if(err){
            console.log(err);
        }else{
            //console.log(campground);
            res.render("comment/new",{campground:campground});
        }
    });
});

// CREATE Route
app.post("/campgrounds/:id/comments",(req,res)=>{
    campgroundList.findOne({_id:req.params.id},(err,campground)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comments.create(req.body.comment,(err,comment)=>{
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, () => {
    console.log('YelpCamp Server has Start at https://mypjbootcamp-mythk.c9users.io/ !!');
});
