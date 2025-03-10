import { User } from "../models/user-model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post-model.js";


const register = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		if (!username || !email || !password) {
			return res.status(404).json({
				message: "something is missing, please check",
				success: false
			});
		}

		const existedUser = await User.findOne({ email });
		if (existedUser) {
			return res.status(409).json({
				message: "Please enter another email",
				success: false
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({
			username,
			email,
			password: hashedPassword
		})

		return res.status(200).json({
			data: user,
			message: "User registerd successfully",
			success: true
		});

	} catch (error) {
		return res.status(500).json({
			message: "failed to register a user",
			success: false
		})
	}
}

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		// console.log(email, password)
		if (!email || !password) {
			return res.status(404).json({
				message: "password or email is required",
				success: false
			});
		}

		let user = await User.findOne({ email });
		// console.log(user)
		if (!user) {
			return res.status(404).json({
				message: "please register first",
				success: false
			});
		}

		// console.log(password, user.password)
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(404).json({
				message: "Invalid user credentials",
				success: false
			});
		}
		// console.log(isPasswordValid)

		const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: "1d" });
		// console.log(token)

		// populate each post if in the posts array 
		const populatedPosts = await Promise.all(
			user.posts.map(async (postId) => {
				const post = await Post.findById(postId);
				if (post && post.author.equals(user._id)) {
					return post;
				}
				return null;
			})
		);
		// console.log(populatedPosts)

		user = {
			_id: user._id,
			username: user.username,
			email: user.email,
			profilePicture: user.profilePicture,
			bio: user.bio,
			followers: user.followers,
			following: user.following,
			posts: populatedPosts
		}
		// console.log(user)

		return res.cookie('token', token, { httpOnly: true, sameSite: "strict", maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
			user,
			message: `Welcom back ${user.username}`,
			success: true
		});

	} catch (error) {
		return res.status(500).json({
			message: "failed to login a user: " + error,
			success: false

		})
	}
}

const logout = async (req, res) => {
	try {
		return res.cookie("token", "", { maxAge: 0 }).json({
			message: "user Logout successfully",
			success: true
		})
	} catch (error) {
		return res.status(500).json({
			message: "failed to logout a user",
			success: false
		})
	}
};

const uploadProfilePicture = async (req, res) => {
	try {
		const userId = req.id;
		const localFilePath = req.file?.path;

		let cloudResponse;

		if (localFilePath) {
			const fileUploaded = await uploadOnCloudinary(localFilePath);
			// console.log(fileUploaded)
			cloudResponse = fileUploaded.secure_url;
			// console.log(cloudResponse)
			if (!fileUploaded.url) {
				return res.status(400).json({
					message: "faild to upload profile picture on cloudinary"
				})
			}
		};
		// console.log(cloudResponse)

		const user = await User.findByIdAndUpdate(userId, { $set: { profilePicture: cloudResponse } }, { new: true }).select("-password");
		// console.log(user)

		return res.status(200).json({
			data: user,
			message: "Profile Picture uploaded successfully",
			success: true
		})

	} catch (error) {
		return res.status(500).json({
			message: "failed to upload a profile picture",
			success: false
		})
	}
};

const getProfile = async (req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) {
			return res.status(404).json({
				message: "userId not found",
				success: false
			});
		}

		// const user = await User.findById(userId).populate({ path: 'posts', populate:{path: "comments", select: "text author", populate:{path: "author", select: "username profilePicture"}}, createdAt: -1 }).select("-password").populate("bookmarks");
		// same uper wali line But with formated text:)
		const user = await User.findById(userId) // Find the user by userId
			.populate({
				path: "followers", 
				select: "username profilePicture bio followers following"
			})
			.populate({
				path: "following", 
				select: "username profilePicture bio followers following"
			})
			.populate({
				path: "posts", // Populate the 'posts' field in the User model
				populate: [ // imp ---> use array inside the populate option to populate multiple fields at the same level.
					{
						path: "author",
						select: "username profilePicture followers"
					},
					{
						path: "comments", // Populate the 'comments' field inside each post
						select: "text author", // Select only 'text' and 'author' fields from comments
						populate: {
							path: "author", // Further populate the 'author' field inside each comment
							select: "username profilePicture", // Select only 'username' and 'profilePicture' fields of the author
						},
					},
				],
				options: { sort: { createdAt: -1 } }, // Sort posts by createdAt (newest first)
			})
			.select("-password") // Exclude the 'password' field from the user data
			.populate({
				path: "bookmarks",
				populate: [
					{
						path: "author",
						select: "username profilePicture followers"
					},
					{
						path: "comments",
						select: "text author",
						populate: {
							path: "author",
							select: "username profilePicture"
						}
					}
				]
			}); // Populate the 'bookmarks' field in the User model


		// console.log(user)
		if (!user) {
			return res.status(404).json({
				message: "No user found",
				success: false
			});
		}

		return res.status(200).json({
			data: user,
			message: "get user profile successfully",
			success: true
		})

	} catch (error) {
		return res.status(500).json({
			message: "failed to get a user profile",
			success: false
		})
	}
}

const editProfile = async (req, res) => {
	try {
		const userId = req.id;
		let { bio, gender } = req.body;
		const localFilePath = req.file?.path;
		// console.log(localFilePath) 
		// console.log(bio, gender)

		// Ensure gender is either 'male', 'female', or null
		if (!["male", "female"].includes(gender)) {
			gender = null;
		}

		let cloudResponse;

		if (localFilePath) {
			const fileUploaded = await uploadOnCloudinary(localFilePath);
			// console.log(fileUploaded)
			cloudResponse = fileUploaded.secure_url;
			// console.log(cloudResponse)
			if (!fileUploaded.url) {
				return res.status(400).json({
					message: "faild to upload photo on cloudinary"
				})
			}
		}

		const user = await User.findById(userId).select("-password");
		if (!user) {
			return res.status(404).json({
				message: "User not found",
				success: false
			})
		};
		// console.log(user.bio)
		// console.log(user.gender)

		if (bio) user.bio = bio;
		if (gender) user.gender = gender;
		if (localFilePath) user.profilePicture = cloudResponse;

		await user.save();

		return res.status(200).json({
			data: user,
			message: "Profile updated successfully",
			success: true
		})

	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: "failed to edit profile",
			success: false
		})
	}

}

const getSuggestedUser = async (req, res) => {
	try {
		const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
		if (!suggestedUsers) {
			return res.status(400).json({
				message: "currently do not have any user",
				success: false
			})
		};

		return res.status(200).json({
			users: suggestedUsers,
			success: true,
		})

	} catch (error) {
		return res.status(500).json({
			message: "failed to find users",
			success: false
		})
	}
}

// const followOrUnfollow = async (req, res) => {
// 	try {
// 		const followKrnaWala = req.id;
// 		const jisKoFollowKruga = req.params.id;
// 		if (!jisKoFollowKruga) {
// 			return res.status(404).json({
// 				message: "Following User id is required"
// 			})
// 		};

// 		if (followKrnaWala === jisKoFollowKruga) {
// 			return res.status(400).json({
// 				message: "You cannot follow/unfollow yourself",
// 				success: false
// 			});
// 		}

// 		const user = await User.findById(followKrnaWala);
// 		const targetUser = await User.findById(jisKoFollowKruga);
// 		if (!user) {
// 			return res.status(404).json({
// 				message: "User not found"
// 			})
// 		}
// 		if (!targetUser) {
// 			return res.status(404).json({
// 				message: "User not found"
// 			})
// 		}

// 		const isFollowing = user.following.includes(jisKoFollowKruga);
// 		if (isFollowing) {
// 			// unfollow logic
// 			await Promise.all([
// 				User.updateOne({ _id: followKrnaWala }, { $pull: { following: jisKoFollowKruga } }),
// 				User.updateOne({ _id: jisKoFollowKruga }, { $pull: { followers: followKrnaWala } })
// 			]);
// 			return res.status(200).json({ message: "unfollowed successfully", success: true });
// 		} else {
// 			// follow logic
// 			await Promise.all([
// 				User.updateOne({ _id: followKrnaWala }, { $push: { following: jisKoFollowKruga } }),
// 				User.updateOne({ _id: jisKoFollowKruga }, { $push: { followers: followKrnaWala } })
// 			]);
// 			return res.status(200).json({ message: "followed successfully", success: true });
// 		}

// 	} catch (error) {
// 		return res.status(500).json({
// 			message: "fail to follow/unfollow a user",
// 			success: false
// 		})
// 	}
// }

const followOrUnfollow = async (req, res) => {
	try {
		const followKrnaWala = req.id; // The user who is following/unfollowing
		const jisKoFollowKruga = req.params.id; // The target user

		if (!jisKoFollowKruga) {
			return res.status(404).json({
				message: "Following User ID is required",
				success: false
			});
		}

		// console.log(followKrnaWala, jisKoFollowKruga)

		if (followKrnaWala === jisKoFollowKruga) {
			return res.status(400).json({
				message: "You cannot follow/unfollow yourself",
				success: false
			});
		}

		const user = await User.findById(followKrnaWala);
		const targetUser = await User.findById(jisKoFollowKruga);

		if (!user || !targetUser) {
			return res.status(404).json({
				message: "User not found",
				success: false
			});
		}

		const isFollowing = user.following.includes(jisKoFollowKruga);

		let updatedUser, updatedTargetUser;

		if (isFollowing) {
			// Unfollow logic
			[updatedUser, updatedTargetUser] = await Promise.all([
				User.findByIdAndUpdate(followKrnaWala, { $pull: { following: jisKoFollowKruga } }, { new: true }),
				User.findByIdAndUpdate(jisKoFollowKruga, { $pull: { followers: followKrnaWala } }, { new: true })
			]);

			return res.status(200).json({
				message: "Unfollowed successfully",
				success: true,
				userfl: updatedUser.followers, // Updated followers array
				userufl: updatedUser.following // Updated following array
			});
		} else {
			// Follow logic
			[updatedUser, updatedTargetUser] = await Promise.all([
				User.findByIdAndUpdate(followKrnaWala, { $push: { following: jisKoFollowKruga } }, { new: true }),
				User.findByIdAndUpdate(jisKoFollowKruga, { $push: { followers: followKrnaWala } }, { new: true })
			]);

			return res.status(200).json({
				message: "Followed successfully",
				success: true,
				userfl: updatedUser.followers, // Updated followers array
				userufl: updatedUser.following // Updated following array
			});
		}
	} catch (error) {
		console.error("Follow/Unfollow Error:", error);
		return res.status(500).json({
			message: "Failed to follow/unfollow a user",
			success: false
		});
	}
};




export {
	register,
	login,
	logout,
	uploadProfilePicture,
	getProfile,
	editProfile,
	getSuggestedUser,
	followOrUnfollow
}