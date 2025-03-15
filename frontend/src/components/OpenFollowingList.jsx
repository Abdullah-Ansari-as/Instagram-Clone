import React, { useEffect, useState } from 'react'
import {
	Dialog,
	DialogContent, 
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { RxCrossCircled } from "react-icons/rx";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';


function OpenFollowingList({openFollowing, setOpenFollowing}) {
	const { user, userProfile } = useSelector(store => store.auth)

	const [input, setInput] = useState("");
 

	const userFollowingSearch = userProfile?.following?.filter((following) => {
        return following.username?.toLowerCase().includes(input?.toLowerCase())
    })


	// follow/unfollow handler
		const [followStatus, setFollowStatus] = useState({});
		// console.log(followStatus)
	
		useEffect(() => {
			if (userProfile) {
				const initialStatus = {};
				userProfile?.following.forEach((followingUser) => {
					initialStatus[followingUser?._id] = followingUser.followers?.includes(user?._id);				
					// console.log(followingUser)
				})
				setFollowStatus(initialStatus);
			}
		}, [userProfile, user?._id]);
	
		const followUnfollowHandler = async (targetUserId) => {
			try {
				setFollowStatus(prev => ({
					...prev,
					[targetUserId]: !prev[targetUserId]
				}))
	
				const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/users/followorUnfollow/${targetUserId}`, {}, { withCredentials: true });
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
		};
 

	return (
		<Dialog open={openFollowing} className=''>
			<DialogContent onInteractOutside={() => setOpenFollowing(false)} className='bg-white w-[82vw] md:w-[30vw] h-[70vh] rounded-xl'>
				<DialogHeader>
					<DialogTitle className='flex justify-center items-center h-10 text-base'>Followings</DialogTitle>
					<hr />
					<div className="flex justify-center mx-3 relative">
						<input
							type="text"
							className="w-full max-w-[90%] md:max-w-[300px] lg:max-w-[400px] bg-[#EFEFEF] pl-5 py-2 rounded-[8px] border border-gray-300 focus:outline-none h-9"
							placeholder="Search"
							value={input}
							onChange={(e) => setInput(e.target.value)}
						/>
						<button onClick={() => setInput("")}><RxCrossCircled className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500" /></button>
					</div>
				</DialogHeader>

				<div className='h-[50vh] overflow-y-auto w-full '>
					{
						userProfile?.following?.length > 0 ? (

							userProfile && userFollowingSearch.map((user) => {
								return (
									<div key={user._id} onClick={() => setOpenFollowing(false)} className='flex items-center mt-3 mx-2 pl-2 justify-between'>
										<div className="flex items-center gap-2">
											<Link to={`/profile/${user._id}`}>
												<Avatar>
													<AvatarImage src={user?.profilePicture} alt='Post_image' className='object-cover' />
													<AvatarFallback className='bg-gray-200'>CN</AvatarFallback>
												</Avatar>
											</Link>
											<div className=''>
												<h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
												<span className='text-gray-600 text-sm'>{user?.bio?.length > 30 ? user?.bio.slice(0, 30) + '...' : user?.bio || "Bio here"}</span>
											</div>
										</div>

										{
											<span onClick={() => followUnfollowHandler(user._id)} className=''>
												<Button className={`text-white rounded-xl bg-[#0095f6] hover:bg-[#0e80cc] p-3 ${followStatus[user?._id] ? "hover:bg-[#cccaca] bg-[#dbdbdb] text-black" : ""}`}>{followStatus[user?._id] ? 'Unfollow' : 'Follow' }</Button>
											</span>
										}

									</div>
								)
							})

						) : (
							<p className='flex justify-center items-center text-sm text-gray-400 font-semibold h-full'>No Followings</p>
						)
					}
				</div>

			</DialogContent>
		</Dialog> 
	)
}

export default OpenFollowingList
