import 'dotenv/config'
import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import connectDB from './utils/db.js';
import { app, server, io } from './socket/socket.js'; 

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended: true})); 

const corsOptions = {
	origin: "http://localhost:5173",
	credentials: true
}
app.use(cors(corsOptions));


// app.get("/", (req, res) => {
// 	return res.status(200).json({
// 		message: "im comming from backend",
// 		success: true
// 	})
// })

// import routes
import userRouter from "./routes/user-routes.js";
import postRouter from "./routes/post-route.js";
import messageRouter from "./routes/message-routes.js";
import storyRouter from "./routes/story-routes.js"

// routes dicleration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/story", storyRouter);


server.listen(process.env.PORT  || 3000, () => {
	connectDB();
	console.log("server is running on port " + process.env.PORT)  
})