import express from "express";
import { isAuthenticated } from "../middlewares/auth-mid.js";
import {upload} from "../middlewares/multer-mid.js";
import { addComment, addNewPost, bookmarkPost, deletePost, getAllPosts, getPostComments, getUserPosts, likePost, unLikePost } from "../controllers/post-controller.js";
const router = express.Router();

router.route('/addpost').post(isAuthenticated, upload.single('image'), addNewPost); 
router.route('/all').get(isAuthenticated, getAllPosts); 
router.route('/userpost/all').get(isAuthenticated, getUserPosts); 
router.route('/:id/like').get(isAuthenticated, likePost); 
router.route('/:id/dislike').get(isAuthenticated, unLikePost); 
router.route('/:id/comment').post(isAuthenticated, addComment); 
router.route('/:id/comment/all').post(isAuthenticated, getPostComments); 
router.route('/delete/:id').delete(isAuthenticated, deletePost); 
router.route('/:id/bookmark').get(isAuthenticated, bookmarkPost); 

export default router;