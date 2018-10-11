const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

const data =[
    {
        name: 'camp1',
        image: 'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
        description : 'bahbah'
    },
    {
        name: 'camp2',
        image: 'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
        description : 'bahbah'
    },
    {
        name: 'camp3',
        image: 'https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
        description : 'bahbah'
    }
];

function SeedDB(){
    // Delete Data
    Campground.deleteMany({},(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("Delete DB");
            
            // Add new Campground data
            data.forEach((seed)=>{
                Campground.create(seed,(err,campground)=>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log("campground added.");
                        
                        // Add comment
                        Comment.create({
                            text:"comment text",
                            author:"waraphon"
                        },(err,comment)=>{
                            if(err){
                                console.log(err);
                            }else{
                                campground.comment.push(comment);
                                campground.save((err,reslut)=>{
                                    if(err){
                                        console.log(err);
                                    }else{
                                        console.log("add comment");
                                    }
                                });
                            }
                        });
                    }
                });
            });
            
        }
    });
}

module.exports = SeedDB;