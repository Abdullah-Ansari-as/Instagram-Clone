import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'


function Posts() {

	// directly array a rha hai posts ka "postSlice.js" file "initialState" me se
	const posts = useSelector(state => state.post.Posts); 
	// console.log(posts)
	return (
		<div>
			{
	  			posts.map((post) => <Post key={post._id} post={post} />)
			}
		</div>
	)
}

export default Posts
