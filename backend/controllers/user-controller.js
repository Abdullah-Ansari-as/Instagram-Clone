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

		// populate each post if in the posts array 
		const populatedPosts = await Promise.all(
			user.posts.map( async (postId) => {
				const post = await Post.findById(postId);
				if(post.author.equals(user._id)) {
					return post;
				}
				return null; 
			})
		)

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

const getProfile = async (req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) {
			return res.status(404).json({
				message: "userId not found",
				success: false
			});
		}

		const user = await User.findById(userId).select("-password");
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
		const { bio, gender } = req.body;
		const localFilePath = req.file?.path; 
		// console.log(localFilePath)

		if (!bio || !gender) {
			return res.status(404).json({
				message: "bio and gender is required",
				success: false
			})
		}

		if (!localFilePath) {
			return res.status(404).json({
				message: "profile Picture is required",
				success: false
			})
		} 
		const fileUploaded = await uploadOnCloudinary(localFilePath);
		// console.log(fileUploaded)
		if (!fileUploaded.url) {
			return res.status(400).json({
				message: "faild to upload photo on cloudinary"
			})
		} 

		const user = await User.findByIdAndUpdate(
			userId,
			{
				$set: {
					profilePicture: fileUploaded.secure_url,
					bio,
					gender
				}
			},
			{ new: true }
		).select("-password");

		if (!user) {
			return res.status(404).json({
				message: "User not found",
				success: false
			})
		};

		return res.status(200).json({
			data: user,
			message: "Profile updated successfully",
			success: true
		})

	} catch (error) {
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

const followOrUnfollow = async (req, res) => {
	try {
		const followKrnaWala = req.id;
		const jisKoFollowKruga = req.params.id;
		if (!jisKoFollowKruga) {
			return res.status(404).json({
				message: "Following User id is required"
			})
		};

		if (followKrnaWala === jisKoFollowKruga) {
			return res.status(400).json({
				message: "You cannot follow/unfollow yourself",
				success: false
			});
		}

		const user = await User.findById(followKrnaWala);
		const targetUser = await User.findById(jisKoFollowKruga);
		if (!user) {
			return res.status(404).json({
				message: "User not found"
			})
		}
		if (!targetUser) {
			return res.status(404).json({
				message: "User not found"
			})
		}

		const isFollowing = user.following.includes(jisKoFollowKruga);
		if (isFollowing) {
			// unfollow logic
			await Promise.all([
				User.updateOne({ _id: followKrnaWala }, { $pull: { following: jisKoFollowKruga } }),
				User.updateOne({ _id: jisKoFollowKruga }, { $pull: { followers: followKrnaWala } })
			]);
			return res.status(200).json({ message: "unfollowed successfully", success: true });
		} else {
			// follow logic
			await Promise.all([
				User.updateOne({ _id: followKrnaWala }, { $push: { following: jisKoFollowKruga } }),
				User.updateOne({ _id: jisKoFollowKruga }, { $push: { followers: followKrnaWala } })
			]);
			return res.status(200).json({ message: "followed successfully", success: true });
		}

	} catch (error) {
		return res.status(500).json({
			message: "fail to follow/unfollow a user",
			success: false
		})
	}
}



export {
	register,
	login,
	logout,
	getProfile,
	editProfile,
	getSuggestedUser,
	followOrUnfollow
}