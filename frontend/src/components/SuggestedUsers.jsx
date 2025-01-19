import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom';

function SuggestedUsers() {
	const { suggestedUsers } = useSelector(store => store.auth);
	// console.log(suggestedUsers)
	return (
		<div className='my-10'>
			<div className='flex items-center justify-between text-sm'>
				<h1 className='font-semibold text-gray-600'>Suggested for you</h1>
				<span className='font-medium cursor-pointer'>See All</span>
			</div>

			{
				suggestedUsers && suggestedUsers.map((user) => {
					return (
						<div key={user._id} className='flex items-center my-4 justify-between'>
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

							<span className='text-xs text-[#3BADF8] font-bold cursor-pointer hover:text-[#2a8aca]'>Follow</span>

						</div>
					)
				})
			}

		</div>
	)
}

export default SuggestedUsers
