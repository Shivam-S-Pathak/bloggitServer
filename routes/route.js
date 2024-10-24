import express from "express";
import { SignUser, LogUser } from "../controller/user-controller.js";
import Blog from "../controller/blog-controller.js";
import { getBlogs, getPost } from "../controller/blog-controller.js";
// import multer from "multer";
// const upload = multer({ dest: "../uploads" });

const router = express.Router();

router.post("/signup", SignUser);
router.post("/login", LogUser);

// router.post("/createblog", upload.single("coverImage"), Blog);
router.post("/createblog", Blog);
router.get("/posts", getBlogs);
router.get("/post/:id", getPost);
export default router;
