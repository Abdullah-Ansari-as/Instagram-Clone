import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
	name: "story",
	initialState: {
		stories: [],
		loggedInUserStory: false
	},
	reducers: {
		// actions
		setStories: (state, action) => {
			state.stories = action.payload;
		},
		setLoggedInUserStory: (state, action) => {
			state.loggedInUserStory = action.payload;
		}
	}
});

export const {setStories, setLoggedInUserStory} = storySlice.actions;

export default storySlice.reducer;