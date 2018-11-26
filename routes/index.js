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
   res.render('register',{page:'register'}); 
});

// register logic
router.post('/register',(req,res)=>{
   const _user = new User({username:req.body.username});
   if(req.body.adminCode == process.env.ADMINCODE){
       _user.admin = true;
   }
   User.register(_user,req.body.password,(err,user)=>{
      if(err){
          console.log(err);
          return res.render("register", {error: err.message});
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
    res.render('login',{page:'login'});
});

// login logic
router.post('/login',passport.authenticate('local',{
    successRedirect:'/campgrounds',
    failureRedirect:'/login',
    failureFlash: 'Invalid username or password.'
}),(req,res)=>{});

// logout route
router.get('/logout',(req,res)=>{
   req.logout();
   req.flash('success','Logged you out!');
   res.redirect('/campgrounds');
});

module.exports = router;