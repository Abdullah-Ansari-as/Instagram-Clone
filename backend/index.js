import 'dotenv/config'
import dotenv from "dotenv";
dotenv.config({path: "./backend/.env"})
import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import connectDB from './utils/db.js';
import { app, server } from './socket/socket.js'; 
// import path from "path";


// const __dirname = path.resolve();
// console.log(__dirname)

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended: true})); 

const corsOptions = {
	origin: "https://instagram-clone-ea31.vercel.app",
	credentials: true
}
app.use(cors(corsOptions));

// import routes
import userRouter from "./routes/user-routes.js";
import postRouter from "./routes/post-route.js";
import messageRouter from "./routes/message-routes.js";
import storyRouter from "./routes/story-routes.js"

app.get("/", (req, res) => {
	res.send("welcome from backend")
})

// routes dicleration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/story", storyRouter);


// app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.get("*", (req, res) => {
// 	res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// })


server.listen(process.env.PORT  || 3000, () => {
	connectDB();
	console.log("server is running on port " + process.env.PORT)  
})