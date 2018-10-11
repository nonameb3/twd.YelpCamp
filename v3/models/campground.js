const mongoose = require("mongoose");

const campgroundSchema = new mongoose.Schema({
  name:String,
  image:String,
  description:String
});
const campgroundList = mongoose.model("campgroundList",campgroundSchema);

module.exports = campgroundList;