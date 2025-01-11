import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post-model.js"
import { User } from "../models/user-model.js";
import { Comment } from "../models/comment-model.js";

const addNewPost = async (req, res) => {
	try {
		const { caption } = req.body;
		const localFilePath = req.file?.path;
		const authorId = req.id;
		if (!caption) {
			return res.status(404).json({
				message: "Post caption is required",
				success: false
			})
		};
		if (!image) {
			return res.status(404).json({
				message: "image is required",
				success: false
			})
		};

		const uploadedFile = await uploadOnCloudinary(localFilePath);

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
		const posts = Post.find().sort({ createdAt: -1 })
			.populate({ path: "author", select: 'username profilePicture' })
			.populate({
				path: "comments",
				sort: { createdAt: -1 },
				populate: {
					path: "author",
					select: "username profilePicture"
				}
			});

			return res.status(200).json({
				message: "All posts fetch successfully",
				posts,
				cuccess: true
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

		await Post.updateOne({ $addToSet: {likes: currentUserId} });
		await Post.save();

		//TODO: implemet socket io for real time notifications
		 

		return res.status(200).json({
			message: "Post liked",
			success: true
		})

	} catch (error) {
		return res.status(500).json({
			message: "Failed to get user's posts",
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

		await Post.updateOne({ $pull: {likes: currentUserId} });
		await Post.save();

		//TODO: implemet socket io for real time notifications
		 

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
	
		const comment = await Comment.create({
				text,
				author: currUserId,
				post: post._id
		}).populate({
			path: "author",
			select: "username profilePicture"
		});
	
		post.comments.push(comment?._id);
		await post.save();
	
		return res.status(201).json({
			comment,
			message: "Comment added successfully",
			success: true
		})
	} catch (error) {
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
		if(!post) return res.status(400).json({message: "Failed to fetch post", success: false});

		// check if the loggedIn user is the owner of the post
		if(post.author.toString() !== postId) {
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