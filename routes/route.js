import express from "express";
import { SignUser, LogUser  , validateEmail , mailSender ,setNewPass} from "../controller/user-controller.js";
import Blog from "../controller/blog-controller.js";
import {
  getBlogs,
  getPost,
  getMyPosts,
  deleteBlog,
  updateBlog,
  addComment,
  getComments,
  deleteComment,
  likepost,
  unlikepost,
} from "../controller/blog-controller.js";
import {
  journal,
  getJournals,
  getJournaldetails,
  updateJournal,
  deleteJournal,
} from "../controller/journal-controller.js";
import { sendOtp, verifyOtp } from "../controller/otp-controller.js";
// import multer from "multer";
// const upload = multer({ dest: "../uploads" });

const router = express.Router();

router.post("/signup", SignUser);
router.post("/login", LogUser);

// router.post("/createblog", upload.single("coverImage"), Blog);
router.post("/createblog", Blog);
router.get("/posts", getBlogs);
router.get("/post/:id", getPost);
router.get("/myblogs/:username", getMyPosts);
router.delete("/delete/:id", deleteBlog);
router.put("/update/:id", updateBlog);
router.post("/createJournal", journal);
router.get("/myJournal/:username", getJournals);
router.get("/journal/:id", getJournaldetails);
router.put("/updateJournal/:id", updateJournal);
router.delete("/deleteJournal/:id", deleteJournal);
router.post("/newComment", addComment);
router.get("/getComment/:id", getComments);
router.delete("/deleteComment/:id", deleteComment);
router.put("/like/:id", likepost);
router.put("/unlike/:id", unlikepost);
router.post("/send-otp/:email", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/validateEmail" , validateEmail);
router.post("/send-mail" , mailSender)
router.post("/set-pass" , setNewPass);
export default router;
