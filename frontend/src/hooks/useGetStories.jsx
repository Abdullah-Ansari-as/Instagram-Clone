import { setStories } from '@/redux/storySlice';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function useGetStories() {

	const {user} = useSelector(store => store.auth);
	const dispatch = useDispatch();

	useEffect(() => {
		const getAllStories = async () => {
			try {
				const res = await axios.get('http://localhost:3000/api/v1/story/stories', { withCredentials: true });
				// console.log(res);
				if(res.data.success) {
					dispatch(setStories(res.data.stories) )
				}
			} catch (error) {
				console.log(error)
			}
		}
		getAllStories();
	}, [user?._id]);

}

export default useGetStories
