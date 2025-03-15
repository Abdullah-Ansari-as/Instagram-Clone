import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'

function SeeAllSuggestedUsers() {
	const { suggestedUsers, user } = useSelector(store => store.auth)

	// follow/unfollow handler
	const [followStatus, setFollowStatus] = useState({})

	useEffect(() => {
		if (suggestedUsers) {
			const initialStatus = {};
			suggestedUsers.forEach((suggestedUser) => {
				initialStatus[suggestedUser?._id] = suggestedUser?.followers.includes(user?._id);
			})
			setFollowStatus(initialStatus);
		}
	}, [suggestedUsers, user?._id]);

	const followUnfollowHandler = async (targetUserId) => {
		try {
			setFollowStatus(prev => ({
				...prev,
				[targetUserId]: !prev[targetUserId]
			}))

			const res = await axios.post(`http://localhost:3000/api/v1/users/followorUnfollow/${targetUserId}`, {}, { withCredentials: true });
			if (res.data.success) {
				toast.success(res.data.message);
			}

		} catch (error) {
			console.log(error)
			setFollowStatus(prev => ({
				...prev,
				[targetUserId]: !prev[targetUserId]
			}))
		}
	}


	return (
		<div className='mt-7 sm:mt-20 w-full sm:w-[32rem] m-auto flex flex-col items-start justify-center'>
			<h1 className='font-semibold mb-4 ml-4 sm:ml-0'>Suggested</h1>
			{
				suggestedUsers && suggestedUsers.map((user) => {
					return (
						<div key={user._id} className='flex w-[90%] sm:w-[32rem] items-center my-3 pl-2 justify-between'>
							<div className="flex items-center gap-2">
								<Link to={`/profile/${user._id}`}>
									<Avatar>
										<AvatarImage src={user?.profilePicture} alt='Post_image' className='object-cover'/>
										<AvatarFallback className='bg-gray-200'>CN</AvatarFallback>
									</Avatar>
								</Link>
								<div className=''>
									<h1 className='font-semibold text-sm'><Link to={`/profile/${user._id}`}>{user?.username}</Link></h1>
									<span className='text-gray-600 text-sm'>{user?.bio?.length > 55 ? user?.bio.slice(0, 55) + '...' : user?.bio || "Bio here"}</span>
								</div>
							</div>

							{
								<span onClick={() => followUnfollowHandler(user._id)} className=''>
									{/* <Button className='text-white rounded-xl bg-[#0095f6] hover:bg-[#0e80cc]'>{followStatus[user?._id] ? 'Unfollow' : 'Follow'}</Button> */}
									<Button className={`text-white rounded-xl bg-[#0095f6] hover:bg-[#0e80cc] p-3 ${followStatus[user?._id] ? "hover:bg-[#cccaca] bg-[#dbdbdb] text-black" : ""}`}>{followStatus[user?._id] ? 'Unfollow' : 'Follow'}</Button>
								</span>
							}

						</div>
					)
				})
			}

			<div className="flex w-full sm:w-[26rem] m-auto items-center justify-center flex-wrap gap-x-4 gap-y-2 text-xs text-[#695e69] mt-16 mb-8">
				<div  className="flex w-full sm:w-[26rem] m-auto items-center justify-center flex-wrap gap-x-4 gap-y-2 text-xs text-[#695e69] mt-16 mb-8">
				<span>Meta</span>
				<span>About</span>
				<span>Blog</span>
				<span>Jobs</span>
				<span>Help</span>
				<span>API</span>
				<span>Privacy</span>
				<span>Terms <br /></span>
				<span>Locations</span>
				<span>Instagram Lite</span>
				<span>Threads</span>
				<span>Meta Verified <br /></span>
				</div>
				<div className='text-xs text-[#695e69] mb-7 mt-4 justify-center'>English  © 2025 Instagram from Meta</div>
			</div>

		</div>
	)
}

export default SeeAllSuggestedUsers
