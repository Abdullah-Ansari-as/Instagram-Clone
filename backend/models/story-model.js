import mongoose from "mongoose";

const storySchema = new mongoose.Schema({ 
	imageUrl: String,
	author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
	createdAt: { type: Date, default: Date.now, expires: "24h" } // Auto-delete after 24 hours
});

export const Story = mongoose.model("Story", storySchema);