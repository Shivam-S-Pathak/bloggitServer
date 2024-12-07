import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: "dwkquccrp",
  api_key: "751256451784478",
  api_secret: process.env.CLOUD,
});

export default cloudinary;
