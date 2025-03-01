import express from "express";  
import { isAuthenticated } from "../middlewares/auth-mid.js";
import {upload} from "../middlewares/multer-mid.js";
import { uploadStory, getAllStories } from "../controllers/story-controller.js";

const router = express.Router();

router.route('/upload/story').post(isAuthenticated, upload.single("storyImage"), uploadStory);
router.route('/stories').get(isAuthenticated, getAllStories);

export default router;