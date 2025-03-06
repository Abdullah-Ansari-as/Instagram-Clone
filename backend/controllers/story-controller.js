import { Story } from "../models/story-model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const uploadStory = async (req, res) => {
	try {
		const localFilePath = req.file?.path;
		const authorId = req.id;
		// console.log(localFilePath)

		if (!localFilePath) {
			return res.status(404).json({
				message: "localfilepath is required",
				success: false
			})
		};

		const uploadedFile = await uploadOnCloudinary(localFilePath);
		// console.log(uploadedFile)

		const newStory = await Story.create({
			imageUrl: uploadedFile.secure_url,
			author: authorId
		});

		if(!newStory) {
			return res.status(500).json({
				message: "failed to add a new story"
			});
		}

		await newStory.populate({ path: "author", select: "username"})

		await newStory.save(); 
		return res.status(201).json({
			newStory, 
			message: "New story added successfully",
			success: true
		})

	} catch (error) {
		return res.status(500).json({
			message: "Failed to upload story",
			success: false
		})
	}
};

const getAllStories = async (req, res) => {
	try {
		const stories = await Story.find().sort({ createdAt: -1 })
		.populate({ path: "author", select: "username profilePicture bio"})

		if(!stories) {
			return res.status(500).json({
				message: "failed to get stories",
				success: false
			})
		}

		return res.status(200).json({
			stories,
			message: "All stories fetch successfully",
			success: true
		})
	} catch (error) {
		return res.status(500).json({
			message: "failed to get all stories",
			success: false
		})
	}
}

export {
	uploadStory,
	getAllStories
}