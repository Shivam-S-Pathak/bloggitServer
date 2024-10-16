import mongoose from "mongoose";

const Connection = async (username,password) => {
  const URL = `mongodb+srv://${username}:${password}@blog-database.oxvwu.mongodb.net/?retryWrites=true&w=majority&appName=blog-database`;
  try {
    await mongoose.connect(URL);
    console.log("succefully connected to database");
  } catch (error) {
    console.log("connection is not completed", error);
  }
};

export default Connection;
