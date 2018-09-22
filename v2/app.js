const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/camp_ground", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

//set model => start
const campgroundSchema = new mongoose.Schema({
  name:String,
  image:String,
  description:String
});
const campgroundList = mongoose.model("campgroundList",campgroundSchema);

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

//end set model

app.get('/', (req, res) => {
  // res.send("Landing Page..."
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  campgroundList.find((err,listcampground)=>{
    if(err){
      console.log(err);
    } else{
      res.render('index',{campgrounds:listcampground});
    }
  });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new');
});

app.post('/campgrounds', (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const desc = req.body.description;
  const newCampground = { name, image, description:desc };
  
  campgroundList.create(newCampground,(err,newCampground)=>{
    if(err){
      console.log(err);
    } else{
      res.redirect('/campgrounds');
    }
  });
});

app.get('/campgrounds/:id',(req,res)=>{
  const ObjectId = require('mongodb').ObjectId;
  const _id = req.params.id;
  
  //return List
  // campgroundList.find({_id:new ObjectId(_id)},
  // (err,querycampground)=>{
  //   if(err){
  //     console.log(err);
  //   }else{
  //     res.render('show',{campground:querycampground});
  //   }
  // })
  
  //return object
  campgroundList.findById(_id,(err,result)=>{
    if(err){
      console.log(err);
    }else{
      res.render('show',{campground:result});
    }
  });
  
});

app.listen(process.env.PORT, process.env.IP, () => {
  console.log('YelpCamp Server has Start at https://mypjbootcamp-mythk.c9users.io/ !!');
});
