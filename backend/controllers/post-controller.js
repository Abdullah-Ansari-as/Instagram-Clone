import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post-model.js"
import { User } from "../models/user-model.js";
import { Comment } from "../models/comment-model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

const addNewPost = async (req, res) => {
	try {
		const { caption } = req.body;
		const localFilePath = req.file?.path;
		const authorId = req.id;

		// console.log(caption, localFilePath, authorId) 

		if (!localFilePath) {
			return res.status(404).json({
				message: "localfilepath is required",
				success: false
			})
		};

		// console.log("before upload...")
		const uploadedFile = await uploadOnCloudinary(localFilePath);
		// console.log("upload complete: ", uploadedFile)

		const post = await Post.create({
			caption,
			image: uploadedFile.secure_url,
			author: authorId
		})
		if (!post) {
			return res.status(500).json({
				message: "failed to add a new post"
			})
		}

		const user = await User.findById(authorId);
		if (user) {
			user.posts.push(post._id);
			await user.save();
		}

		await post.populate({ path: 'author', select: "-password" });

		return res.status(201).json({
			post,
			message: "New post added successfully",
			success: true
		})
 

	} catch (error) {
		return res.status(500).json({
			message: "Failed to upload post",
			success: false
		})
	}
}

const getAllPosts = async (req, res) => {
	try {
		const posts = await Post.find().sort({ createdAt: -1 })
			.populate({ path: "author", select: 'username profilePicture followers' })
			.populate({
				path: "comments",
				sort: { createdAt: -1 },
				populate: {
					path: "author",
					select: "username profilePicture"
				}
			});

			// console.log(posts)

			return res.status(200).json({
				message: "All posts fetch successfully",
				posts,
				success: true
			})
	} catch (error) {
		return res.status(500).json({
			message: "Failed to get all posts",
			success: false
		})
	}
}

const getUserPosts = async (req, res) => {
	try {
		const authorId = req.id;

		const posts = await Post.find({author: authorId}).sort({createdAt: -1})
		.populate({
			path: 'author',
			select: "username profilePicture"
		}).populate({
			path: "comments",
				sort: { createdAt: -1 },
				populate: {
					path: "author",
					select: "username profilePicture"
				}
		});

		return res.status(200).json({
			message: "fetch user's post successfully",
			posts,
			cuccess: true
		})	

	} catch (error) {
		return res.status(500).json({
			message: "Failed to get user's posts",
			success: false
		})
	}
}

const likePost = async (req, res) => {
	try {
		const currentUserId = req.id;
		const postId = req.params.id;
		const post = await Post.findById(postId);
		if(!post) {
			return res.status(404).json({
				message: "Post not found",
				success: false
			})
		}


		await post.updateOne({ $addToSet: {likes: currentUserId} });
		await post.save();

		// implemet socket io for real time notifications
		const user = await User.findById(currentUserId).select('username profilePicture');
		const postOwnerId = post.author.toString();
		if(postOwnerId !== currentUserId) {
			// emit a notification event
			const notification = {
				type: 'like',
				userId: currentUserId,
				userDetails: user,
				postId,
				message: "your post was liked"
			}
			const postOwnerSocketId = getReceiverSocketId(postOwnerId)
			io.to(postOwnerSocketId).emit('notification', notification)
		}


		return res.status(200).json({
			message: "Post liked",
			success: true
		})

	} catch (error) {
		return res.status(500).json({
			message: "Failed to like a post",
			success: false
		})
	}
}

const unLikePost = async (req, res) => {
	try {
		const currentUserId = req.id;
		const postId = req.params.id;
		const post = await Post.findById(postId);
		if(!post) {
			return res.status(404).json({
				message: "Post not found",
				success: false
			})
		}

		await post.updateOne({ $pull: {likes: currentUserId} });
		await post.save();

		// implemet socket io for real time notifications
		const user = await User.findById(currentUserId).select('username profilePicture');
		const postOwnerId = post.author.toString();
		if(postOwnerId !== currentUserId) {
			// emit a notification event
			const notification = {
				type: 'dislike',
				userId: currentUserId,
				userDetails: user,
				postId,
				message: "your post was liked"
			}
			const postOwnerSocketId = getReceiverSocketId(postOwnerId)
			io.to(postOwnerSocketId).emit('notification', notification)
		}
		 

		return res.status(200).json({
			message: "Post UnLiked",
			success: true
		})

	} catch (error) {
		return res.status(500).json({
			message: "Failed to get user's posts",
			success: false
		})
	}
}

const addComment = async (req, res) => {
	try {
		const currUserId = req.id;
		const postId = req.params.id;
		const {text} = req.body;
	
		if(!postId) return res.status(404).json({message: "Post Id is required"});
		if(!text) return res.status(404).json({message: "Text is required"});
	
		const post = await Post.findById(postId);
		if(!post) {
			return res.status(404).json({
				message: "Post not fount"
			})
		};
		// console.log(post)  

		const comment = await Comment.create({
				text,
				author: currUserId,
				post: post._id
		})
		
		await comment.populate({
			path: "author",
			select: "username profilePicture"
		})

		// console.log(comment)
	
		post.comments.push(comment?._id);
		await post.save();
	
		return res.status(201).json({
			comment,
			message: "Comment added successfully",
			success: true
		})
		
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: "Failed to add a comment",
			success: false
		})
	}

}

const getPostComments = async (req, res) => {
	try {
		const postId = req.params.id;
		if(!postId) return res.status(400).json({message: "postId is required", success: false});

		const comments = await Comment.find({post: postId}).populate('author', 'username profilePicture');
		if(!comments) return res.status(404).json({message: "No comments found on this post", success: false});

		return res.status(201).json({
			comments,
			message: "Post Comments find successfully",
			success: true
		})

	} catch (error) {
		return res.status(500).json({
			message: "Failed to get post comments",
			success: false
		})
	}
}

const deletePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const authorId = req.id;

		const post = await Post.findById(postId);
		if(!post) return res.status(400).json({message: "Post not found", success: false});

		// console.log(post.author.toString(), authorId)
		// check if the loggedIn user is the owner of the post
		if(post.author.toString() !== authorId) {
			return res.status(403).json({	
				message: "Unauthorized",
				success: false
			})
		};

		// delete post
		await Post.findByIdAndDelete(postId);

		// remove the post Id from the user's post
		let user = await User.findById(authorId);
		user.posts = user.posts.filter(id => id.toString() !== postId);
		await user.save();

		// delete associated comments
		await Comment.deleteMany({post: postId});

		return res.status(200).json({
			message: "Post deleted successfully",
			success: true
		})

	} catch (error) {
		return res.status(500).json({
			message: "Failed to delete this post",
			success: false
		})
	}
}

const bookmarkPost = async (req, res) => {
	try {
		const postId = req.params.id;
		const authorId = req.id;
		
		const post = await Post.findById(postId);
		if(!post) return res.status(404).json({ message: "post not found"});

		const user = await User.findById(authorId);
		if(user.bookmarks.includes(post._id)) {
			// already bookmark -> remove from the bookmark
			await user.updateOne({$pull: {bookmarks: post._id}});
			await user.save()
			return res.status(200).json({type: 'Unsaved', message: "post is removed from bookmark", success: true});

		} else {
			await user.updateOne({$addToSet: {bookmarks: post._id}});
			await user.save()
			return res.status(200).json({type: 'Saved', message: "post bookmarked", success: true});
		}

	} catch (error) {
		return res.status(500).json({
			message: "Failed to bookmark",
			success: false
		})
	}
}


export {
	addNewPost,
	getAllPosts,
	getUserPosts,
	likePost,
	unLikePost,
	addComment,
	getPostComments,
	deletePost,
	bookmarkPost
}