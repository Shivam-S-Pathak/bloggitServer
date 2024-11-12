import blogPost from "../model/blog.js";
import commentPost from "../model/comment.js";
import likepost from "../model/like.js";

const Blog = async (request, response) => {
  try {
    const { title, discription, body, category, date, username, editor } =
      request.body;
    // const coverImage = request.file?.path;

    const post = new blogPost({
      title,
      discription,
      body,
      Category: category,
      date,
      username,
      editor,
      // coverImage,
    });
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

export const getPost = async (request, response) => {
  try {
    const post = await blogPost.findById(request.params.id);
    return response.status(200).json(post);
  } catch (error) {
    return response.status(500).json({ msg: error.message });
  }
};

export const getMyPosts = async (request, response) => {
  try {
    const myPosts = await blogPost.find({ username: request.query.username });
    response.status(200).json(myPosts);
  } catch (error) {
    return response.status(500).json({ msg: error.message });
  }
};

export const deleteBlog = async (request, response) => {
  try {
    const postId = request.params.id;
    const result = await blogPost.findByIdAndDelete(postId);

    if (!result) {
      return response.status(404).json({ msg: "Post not found" });
    }

    response.status(200).json({ msg: "Post deleted successfully" });
  } catch (error) {
    response.status(500).json({ msg: error.message });
  }
};
export const updateBlog = async (request, response) => {
  try {
    const postId = request.params.id;

    const { title, discription, body, category, username, editor } =
      request.body;

    const result = await blogPost.findByIdAndUpdate(
      postId,
      {
        title,
        discription,
        body,
        category,
        username,
        editor,
      },
      { new: true }
    );

    if (!result) {
      return response.status(404).json({ msg: "Post not found" });
    }

    return response
      .status(200)
      .json({ msg: "Post updated successfully", post: result });
  } catch (error) {
    return response.status(500).json({ msg: error.message });
  }
};
export const addComment = async (request, response) => {
  try {
    const newComment = new commentPost(request.body);
    await newComment.save();

    response.status(200).json({ msg: "comment is saved successfully" });
  } catch (error) {
    response.status(500).json({ msg: error.message });
  }
};

export const getComments = async (request, response) => {
  try {
    const result = await commentPost.find({ id: request.query.id });
    response.status(200).json(result);
  } catch (error) {
    return response.status(500).json({ msg: error.message });
  }
};

export const deleteComment = async (request, response) => {
  try {
    const commId = request.params.id;
    let result = await commentPost.findByIdAndDelete(commId);
    if (!result) {
      return response.status(404).json({ msg: "comment not found" });
    }
    response.status(200).json({ msg: "Post deleted successfully" });
  } catch (error) {
    response.status(500).json({ msg: error.message });
  }
};

export const toggleLike = async (request, response) => {
  try {
    const { postId, like, userId } = request.body;
    const newLike = new likepost({
      postId,
      like,
      userId,
    });
    await newLike.save();

    return response.status(200).json("like saved successfully");
  } catch (error) {
    console.log(error);
    return response.status(500).json(error.code);
  }
};

export default Blog;
