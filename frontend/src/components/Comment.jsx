import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'

function Comment({ comment }) {
	// console.log(comment) 
	return (
		<div className='my-2'>
			<div className='flex gap-3 items-center'>
				<Link to={`/profile/${comment?.author?._id}`}>
					<Avatar>
						<AvatarImage src={comment?.author?.profilePicture} className='object-cover'/>
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</Link>
				<h1 className='font-bold text-sm text-black break-all'><Link to={`/profile/${comment?.author?._id}`}>{comment?.author?.username}</Link> <span className='font-normal pl-1 '>{comment?.text}</span></h1>
			</div>
		</div>
	)
}

export default Comment
