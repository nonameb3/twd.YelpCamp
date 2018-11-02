const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');


//=======================
//    AUTH ROUTE
//=======================

// landing page
router.get('/', (req, res) => {
    res.render('landing');
});

// show register page
router.get('/register',(req,res)=>{
   res.render('register'); 
});

// register logic
router.post('/register',(req,res)=>{
   const _user = new User({username:req.body.username});
   User.register(_user,req.body.password,(err,user)=>{
      if(err){
          console.log(err);
          req.flash('error', err.message);
          res.redirect('/register');
      } else{
          passport.authenticate("local")(req,res,()=>{
            req.flash('success','Wellcome to YelpCamp ' + user.username);
            res.redirect("/campgrounds");
          });
      }
   });
});

// show login page
router.get('/login',(req,res)=>{
    res.render('login');
});

// login logic
router.post('/login',passport.authenticate('local',{
    successRedirect:'/campgrounds',
    failureRedirect:'/login'
}),(req,res)=>{});

// logout route
router.get('/logout',(req,res)=>{
   req.logout();
   req.flash('success','Logged you out!');
   res.redirect('/campgrounds');
});

module.exports = router;