// Add System
require('dotenv').config();

const   express = require('express'),
        app = express(),
        bodyParser = require('body-parser'),
        flash = require('connect-flash'),
        methodOverride = require('method-override'),
        mongoose = require('mongoose'),
        passport = require('passport'),
        LocalStrategy = require('passport-local');
        
// Add Route
const   campgroundRoute = require('./routes/campground');
const   commentRoute = require('./routes/comment');
const   indexRoute = require('./routes/index');
const   reviewRoute = require('./routes/reviews');

// Add Models
const   User = require('./models/user');

// MongoDB Config
const mongodbURL = process.env.DATABASEURL;
mongoose.connect(mongodbURL,{ useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// App Config
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());
app.locals.moment = require('moment');

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

// User Pass to another page Config
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// Route
app.use('/',indexRoute);
app.use('/campgrounds',campgroundRoute);
app.use('/campgrounds/:id/comments',commentRoute);
app.use("/campgrounds/:id/reviews", reviewRoute);

//==============
//  start port
//==============

const port = process.env.PORT || 9000;
app.listen(port, process.env.IP, () => {
    console.log('YelpCamp Server has start at: ' + port);
});
