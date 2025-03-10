import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';


function RightSidebar() {

	const [storyCircle, setStoryCircle] = useState(false)

	const { user } = useSelector(store => store.auth);
	// console.log(user)	 

	const { loggedInUserStory } = useSelector(store => store.story)
	// console.log(stories)
	// console.log(loggedInUserStory)

	useEffect(() => {
		if(loggedInUserStory) {
			setStoryCircle(loggedInUserStory)
		}
	}, [loggedInUserStory])
 

	if (!user) return null;


	return (
		<div className='w-fit my-10 pr-20 hidden 945px:block'>
			<div className="flex items-center gap-2">
				<Link to={`/profile/${user?._id}`}>
					<div className={`${storyCircle && 'p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 rounded-full'}`}>
						<Avatar className='border-2 border-white'>
							<AvatarImage src={user?.profilePicture} alt='Post_image' className='object-cover' />
							<AvatarFallback className='bg-gray-200'>CN</AvatarFallback>
						</Avatar>
					</div>
				</Link>
				<div className=''>
					<h1 className='font-semibold text-sm'><Link to={`/profile/${user._id}`}>{user?.username}</Link></h1>
					<span className='text-gray-600 text-sm'>{user?.bio?.length > 30 ? user?.bio.slice(0, 30) + '...' : user?.bio || "Bio here"}</span>
				</div>
			</div>

			<SuggestedUsers />

		</div>
	)
}

export default RightSidebar
