import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: null,
		suggestedUsers: [],
		userProfile: null,
		selectedUser: null,
		followers: [],
		followings: [], 
		loggedInUserProfilePicture: null
	},
	reducers: {
		// actions
		setAuthUser: (state, action) => {
			state.user = action.payload;
		},
		setSuggestedUsers: (state, action) => {
			state.suggestedUsers = action.payload
		},
		setUserProfile: (state, action) => {
			state.userProfile = action.payload;
		},
		setSelectedUser: (state, action) => {
			state.selectedUser = action.payload;
		},
		setFollowers: (state, action) => {
			state.followers = action.payload;
		},
		setFollowings: (state, action) => {
			state.followings = action.payload;
		}
		
	}
})

export const {setAuthUser, setSuggestedUsers, setUserProfile, setSelectedUser, setFollowers, setFollowings, setLoggedInUserProfilePicture} = authSlice.actions;

export default authSlice.reducer