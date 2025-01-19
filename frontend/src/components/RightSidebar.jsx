import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';
 

function RightSidebar() {

	const { user } = useSelector(store => store.auth);
	// console.log(user)

	return (
		<div className='w-fit my-10 pr-32 hidden 945px:block'>
			<div className="flex items-center gap-2">
				<Link to={`/profile/${user._id}`}>
					<Avatar>
						<AvatarImage src={user?.profilePicture} alt='Post_image' />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</Link>
				<div className=''>
					<h1 className='font-semibold text-sm'><Link to={`/profile/${user._id}`}>{user?.username}</Link></h1>
					<span className='text-gray-600 text-sm'>{user?.bio || "Bio here"}</span>
				</div>
			</div>

			<SuggestedUsers />
			
		</div>
	)
}

export default RightSidebar
