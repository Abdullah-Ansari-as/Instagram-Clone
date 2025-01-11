import React from 'react'
import Post from './Post'

function Posts() {
  return (
	<div>
		{
	  [1,2,3,4].map(() => <Post />)
		}
	</div>
  )
}

export default Posts
