import blogPost from "../model/blog.js";

const Blog = async (request, response) => {
  try {
    const { title, discription, body, category, date, author } = request.body;
    // const coverImage = request.file?.path;

    const post = new blogPost({
      title,
      discription,
      body,
      Category: category,
      date,
      author,
      // coverImage,
    });
    console.log(post);
    await post.save();

    return response.status(200).json("blog posted successfully");
  } catch (error) {
    console.log(error);
    return response.status(500).json(error.code);
  }
};

export const getBlogs = async (resquest, response) => {
  try {
    const AllPosts = await blogPost.find({});

    return response.status(200).json(AllPosts);
  } catch (error) {
    return response.status(500).json({ msg: error.message });
  }
};

export default Blog;
