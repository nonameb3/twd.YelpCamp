const express = require('express');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

const campgrounds = [{
  name: 'camp1',
  image: 'https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104496f3c079aeedbdb0_340.jpg',
},
{
  name: 'camp2',
  image: 'https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104496f3c079aeedbdb0_340.jpg',
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
