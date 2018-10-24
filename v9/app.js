// Add System
const   express = require('express'),
        app = express(),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        passport = require('passport'),
        LocalStrategy = require('passport-local');

// Add Route
const   campgroundRoute = require('./routes/campground');
const   commentRoute = require('./routes/comment');
const   indexRoute = require('./routes/index');

// Add Models
const   campgroundList = require('./models/campground'),
        Comments = require("./models/comment"),
        User = require('./models/user');
const seedDB = require('./seeds');
//seedDB(); // seed DB

// MongoDB Config
mongoose.connect("mongodb://localhost:27017/yelp_camp_v8",{ useNewUrlParser: true });
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

// User Pass to any page Config
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

// Route
app.use('/',indexRoute);
app.use('/campgrounds',campgroundRoute);
app.use('/campgrounds/:id/comments',commentRoute);

//==============
//  start port
//==============

app.listen(process.env.PORT, process.env.IP, () => {
    console.log('YelpCamp Server has Start at https://mypjbootcamp-mythk.c9users.io/ !!');
});
