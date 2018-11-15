const mongoose = require("mongoose");

const campgroundSchema = new mongoose.Schema({
  name:String,
  image:String,
  description:String,
  price:String,
  location:String,
  lat:Number,
  lng:Number,
  createDate:{ type:Date , default: Date.now },
  author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username:String
  },
  comments:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }  
  ],
  reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
  ],
  rating: {
        type: Number,
        default: 0
    }
});
const campgroundList = mongoose.model("campgroundList",campgroundSchema);

module.exports = campgroundList;