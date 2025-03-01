import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux' 
import AddStory from './AddStory';
import useGetStories from '@/hooks/useGetStories';


function Posts() {
	useGetStories();

	// directly [array] a rha hai posts ka "postSlice.js" file "initialState" me se
	const {posts} = useSelector(store => store.post);  
	// console.log(posts)
	return (
		<div>
			<AddStory /> 
			{
	  			posts.slice().reverse().map((post) => <Post key={post._id} post={post} />)
			}
		</div>
	)
}

export default Posts
