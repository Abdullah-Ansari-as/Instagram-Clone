import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import SeeAllSuggestedUsers from './SeeAllSuggestedUsers';

function SuggestedUsers() {


	const { suggestedUsers, user } = useSelector(store => store.auth);
	// console.log(suggestedUsers)
	const navigate = useNavigate();

	// follow/unfollow handler
	const [followStatus, setFollowStatus] = useState({})

	useEffect(() => {
		if (suggestedUsers) {
			const initialStatus = {};
			suggestedUsers.forEach((suggestedUser) => {
				// console.log(suggestedUser)
				initialStatus[suggestedUser._id] = suggestedUser.followers.includes(user?._id); // Key = user ID, Value = follow/unfollow status
			});
			// console.log(initialStatus)
			setFollowStatus(initialStatus);
		}
	}, [suggestedUsers, user?._id]);

	// console.log(followStatus)

	const followUnfollowHandler = async (targetUserId) => {
		try {
			setFollowStatus(prev => {
				return {
					...prev,
					[targetUserId]: !prev[targetUserId]
				}
			});

			const res = await axios.post(`http://localhost:3000/api/v1/users/followorUnfollow/${targetUserId}`, {}, { withCredentials: true });
			if (res.data.success) {
				toast.success(res.data.message);
			}

		} catch (error) {
			console.log(error)
			// Revert if API call fails
			setFollowStatus(prev => ({
				...prev,
				[targetUserId]: !prev[targetUserId]
			}));
		}
	}

	const handleSeeAllUsers = () => {
		navigate('/explore/suggested-users')
	}


	return (
		<div className='my-10'>
			<div className='flex items-center justify-between text-sm'>
				<h1 className='font-semibold text-gray-600'>Suggested for you</h1>
				<span className='font-medium cursor-pointer hover:text-gray-500' onClick={handleSeeAllUsers}>See All</span>
			</div>

			{
				suggestedUsers && suggestedUsers.slice(0, 5).map((user) => {
					return (
						<div key={user._id} className='flex items-center my-4 justify-between'>
							<div className="flex items-center gap-2">
								<Link to={`/profile/${user._id}`}>
									<Avatar>
										<AvatarImage src={user?.profilePicture} alt='Post_image' className='object-cover'/>
										<AvatarFallback className='bg-gray-200'>CN</AvatarFallback>
									</Avatar>
								</Link>
								<div className=''>
									<h1 className='font-semibold text-sm'><Link to={`/profile/${user._id}`}>{user?.username}</Link></h1>
									<span className='text-gray-600 text-sm'>{user?.bio.length > 23 ? user?.bio.slice(0, 23) + '...' : user?.bio || "Bio here"}</span>
								</div>
							</div>

							{
								<span onClick={() => followUnfollowHandler(user?._id)} className={`text-xs w-12 text-[#3BADF8] font-bold cursor-pointer hover:text-[#2a8aca] ml-6 ${followStatus[user?._id] ? "text-[#424242] hover:text-[#353434]" : ""}`}>
									{followStatus[user?._id] ? 'Unfollow' : 'Follow'}
								</span>
							}

						</div>
					)
				})
			}
			{/* <SeeAllSuggestedUsers /> */}

			<div className="flex w-64 flex-wrap gap-x-4 gap-y-2 text-xs text-gray-400  mt-8 mb-4 ">
				<span>About</span>
				<span>Help</span>
				<span>Press</span>
				<span>API</span>
				<span>Jobs</span>
				<span>Privacy</span>
				<span>Terms <br /></span>
				<span>Locations</span>
				<span>Language</span>
				<span>Meta Verified</span>
				<p className='mt-4'>© 2025 Instagram from Meta</p>
			</div>


		</div>
	)
}

export default SuggestedUsers
