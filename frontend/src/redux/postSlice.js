import {createSlice} from "@reduxjs/toolkit";

const postSlice = createSlice({
	name: 'post',
	initialState: {
		Posts: [],
	},
	reducers: {
		//actions
		setPosts:(state, action) => {
			state.Posts = action.payload;
		}
	}
});

export const {setPosts} = postSlice.actions;

export default postSlice.reducer;