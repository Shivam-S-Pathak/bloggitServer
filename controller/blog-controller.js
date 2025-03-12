import blogPost from "../model/blog.js";
import commentPost from "../model/comment.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "Events", // Folder name in Cloudinary
//     allowed_formats: ["jpg", "jpeg", "png"],
//   },
// });
// export const upload = multer({ storage });

const Blog = async (request, response) => {
  try {
    const { title, discription, body, category, date, username, editor } =
      request.body;
    // const coverImage = await cloudinary.uploader
    //   .upload(request.file.path)
    //   .catch((error) => {
    //     console.error("Cloudinary Upload Error:", error);
    //     throw new Error("Cloudinary upload failed");
    //   });
    const post = new blogPost({
      title,
      discription,
      body,
      Category: category,
      date,
      username,
      editor,
      // coverImage: coverImage.secure_url,
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
    const coverImage = await cloudinary.uploader.upload(request.file.path);

    const result = await blogPost.findByIdAndUpdate(
      postId,
      {
        title,
        discription,
        body,
        category,
        username,
        editor,
        coverImage: coverImage.secure_url,
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

export const likepost = async (request, response) => {
  try {
    const { id, username } = request.body;

    const post = await blogPost.findById(id);

    if (!post) {
      return response.status(404).json({ error: "Post not found" });
    }

    // Check if the user has already liked the post
    if (!post.likedBy.includes(username)) {
      post.likedBy.push(username);

      await post.save();

      return response.status(200).json({ msg: "post is liked successfully" });
    } else {
      return response
        .status(400)
        .json({ error: "User has already liked the post" });
    }
  } catch (error) {
    console.error("Error liking post:", error);
    return response.status(500).json({ error: "Server error" });
  }
};

export const unlikepost = async (request, response) => {
  try {
    const { id, username } = request.body;

    const post = await blogPost.findById(id);

    if (!post) {
      return response.status(404).json({ error: "Post not found" });
    }

    // Check if the user has liked the post
    const index = post.likedBy.indexOf(username);
    if (index !== -1) {
      post.likedBy.splice(index, 1);
      await post.save();
      return response.status(200).json({ msg: "like removed succefully " });
    } else {
      return response
        .status(400)
        .json({ error: "User has not liked the post" });
    }
  } catch (error) {
    console.error("Error unliking post:", error);
    return response.status(500).json({ error: "Server error" });
  }
};

export default Blog;
