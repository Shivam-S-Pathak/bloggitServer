import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  recogniseBy: [
    {
      type: String,
      required: false,
    },
  ],
});

const User = mongoose.model("user", userSchema);

export default User;