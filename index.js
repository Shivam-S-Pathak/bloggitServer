import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Connection from "./database/db.js";
import dotenv from "dotenv";
import Router from "./routes/route.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://bloggit-client.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true,
  })
); // to eliminate the cors error through by the browser
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", Router);
// const PORT = 9000;
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

Connection(USERNAME, PASSWORD);
app.get('/',(req,res)=>{
  res.json("hello")
})

app.listen(() => console.log(`server is running on port `));
