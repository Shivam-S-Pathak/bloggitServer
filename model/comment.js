import mongoose from "mongoose";

const commentSchema=mongoose.Schema({
id:{
    type:String,
    required:true,
},
username:{
    type:String,
    required:true,
},
comment:{
    type:String,
    required:true,
},
date:{
    type:Date,
    required:true,
},
})

const commentPost=mongoose.model("CommentPost" , commentSchema);

export default commentPost;