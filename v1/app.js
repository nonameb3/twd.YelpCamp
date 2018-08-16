const express = require('express');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

const campgrounds = [{
  name: 'camp1',
  image: 'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
},
{
  name: 'camp2',
  image: 'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
},
{
  name: 'camp3',
  image: 'https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg',
},
{
  name: 'camp1',
  image: 'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
},
{
  name: 'camp2',
  image: 'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
},
{
  name: 'camp3',
  image: 'https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg',
},
{
  name: 'camp1',
  image: 'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
},
{
  name: 'camp2',
  image: 'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
},
{
  name: 'camp3',
  image: 'https://farm3.staticflickr.com/2259/2182093741_164dc44a24.jpg',
},
];

app.get('/', (req, res) => {
  // res.send("Landing Page..."
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  res.render('campgrounds', {
    campgrounds,
  });
});

app.get('/campgrounds/new', (req, res) => {
  res.render('new.ejs');
});

app.post('/campgrounds', (req, res) => {
  const name = req.body.name;
  const image = req.body.image;
  const newCampground = { name, image };
  campgrounds.push(newCampground);

  res.redirect('/campgrounds');
  // Get data from form to arry => to get
});

app.listen(3000, () => {
  console.log('YelpCamp Server has Start at http://localhost:3000/ !!');
});
