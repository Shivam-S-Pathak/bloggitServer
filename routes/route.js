import express from "express";
import SignUser from "../controller/user-controller.js";
import { LogUser } from "../controller/user-controller.js";

const router = express.Router();

router.post("/signup", SignUser);
router.post("/login", LogUser);

export default router;
