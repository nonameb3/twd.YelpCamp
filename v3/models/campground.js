const mongoose = require("mongoose");

const campgroundSchema = new mongoose.Schema({
  name:String,
  image:String,
  description:String,
  comments:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }  
]
});
const campgroundList = mongoose.model("campgroundList",campgroundSchema);

module.exports = campgroundList;