// Add System
const   express = require('express'),
        app = express(),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        passport = require('passport'),
        LocalStrategy = require('passport-local');

// Add Models
const   campgroundList = require('./models/campground'),
        Comments = require("./models/comment"),
        User = require('./models/user');
const seedDB = require('./seeds');
seedDB();

// MongoDB Config
mongoose.connect("mongodb://localhost:27017/yelp_camp_v6",{ useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

// Passport Config
app.use(require("express-session")({
    secret : "YelpCamp Key",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//================
//      ROUTE
//================

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
app.get("/campgrounds/:id/comments/new",isLoggedIn, (req,res)=>{
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
app.post("/campgrounds/:id/comments",isLoggedIn,(req,res)=>{
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

//=======================
//    AUTH ROUTE
//=======================

// show register page
app.get('/register',(req,res)=>{
   res.render('register'); 
});

// register logic
app.post('/register',(req,res)=>{
   const _user = new User({username:req.body.username});
   User.register(_user,req.body.password,(err,user)=>{
      if(err){
          console.log(err);
          res.render('register');
      } else{
          passport.authenticate("local")(req,res,()=>{
                res.redirect("/campgrounds");
          });
      }
   });
});

// show login page
app.get('/login',(req,res)=>{
    res.render('login');
});

// login logic
app.post('/login',passport.authenticate('local',{
    successRedirect:'/campgrounds',
    failureRedirect:'/login'
}),(req,res)=>{});

// logout route
app.get('/logout',(req,res)=>{
   req.logout();
   res.redirect('/campgrounds');
});

// check auth
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

//==============
//  start port
//==============

app.listen(process.env.PORT, process.env.IP, () => {
    console.log('YelpCamp Server has Start at https://mypjbootcamp-mythk.c9users.io/ !!');
});
