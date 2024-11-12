import mongoose from "mongoose";

const likeSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  like: {
    type:Boolean,
    required: true,
  },
});

const likepost = mongoose.model("likePost", likeSchema);

export default likepost;
