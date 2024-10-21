import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  discription: {
    type: String,
    required: true,
  },
  // coverImage: {
  //   type: String,
  //   required: true,
  // },
  Category: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});

const blogPost = mongoose.model("Blogdata", blogSchema, "Blogdata");

export default blogPost;
