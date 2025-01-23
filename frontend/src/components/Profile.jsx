import useGetUserProfile from '@/hooks/useGetUserProfile'
import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Contact, Heart, MessageCircle, Save, TableCellsMerge, Video } from 'lucide-react';

function Profile() {
	const params = useParams();
	const userId = params.id;
	useGetUserProfile(userId)

	const { userProfile, user } = useSelector(store => store.auth);
	// console.log(user);
	// console.log(userProfile);

	// let bioLength = userProfile.bio.length;
	const [isExpand, setIsExpand] = useState(false)

	const [activeTab, setActiveTab] = useState('posts')

	const isLoggedInUserProfile = user?._id === userProfile?._id
	const isFollowing = false

	const activeTabHandler = (tab) => {
		setActiveTab(tab)
	}

	const expandBioHandler = () => {
		setIsExpand(!isExpand)
	}

	const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks

	return (
		<div className='flex w-[67rem] mx-auto pl-20'>
			<div className="flex w-[67rem] flex-col gap-10 pl-20 py-8 ">

				<div className='grid grid-cols-2'>

					<section className='flex items-center justify-center'>
						<Avatar className='h-40 w-40 mr-10'>
							<AvatarImage src={userProfile?.profilePicture} alt="profile_Photo" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
					</section>

					<section className='w-[25rem]'>
						<div className="flex flex-col gap-3 mt-2">
							<div className='flex items-center gap-2'>
								<span className='text-lg font-semibold'>{userProfile?.username}</span>
								{
									isLoggedInUserProfile ? (
										<>
											<Link to="/account/edit"><Button variant='secondary' className='bg-[#eeeded] hover:bg-[#dbdbdb] h-8 rounded-xl'>Edit profile</Button></Link>
											<Button variant='secondary' className='bg-[#eeeded] hover:bg-[#dbdbdb] h-8 rounded-xl'>View archive</Button>
											<Button variant='secondary' className='bg-[#eeeded] hover:bg-[#dbdbdb] h-8 rounded-xl'>Ad tools</Button>
										</>
									) : (
										isFollowing ? (
											<>
												<Button variant='secondary' className='bg-[#eeeded] hover:bg-[#dbdbdb] h-8 rounded'>Unfollow</Button>
												<Button variant='secondary' className='bg-[#eeeded] hover:bg-[#dbdbdb] h-8 rounded'>Message</Button>
											</>
										) : (
											<Button className='bg-[#0095f6] hover:bg-[#0e80cc] h-8 rounded-xl ml-6'>Follow</Button>
										)

									)
								}
							</div>

							<div className='flex items-center gap-7 mt-3'>
								<p> <span className='font-semibold'>{userProfile?.posts.length}</span> posts</p>
								<p> <span className='font-semibold'>{userProfile?.followers.length}</span> followers</p>
								<p> <span className='font-semibold'>{userProfile?.following.length}</span> following</p>
							</div>
						</div>

						<div className="flex flex-col gap-1">
							<span className="font-medium mt-4 h-10">{userProfile?.bio.length > 30 ? (
								<>
									{isExpand ? userProfile.bio : userProfile.bio.slice(0, 30) + '... '}
									<button onClick={expandBioHandler} className='text-gray-400 text-sm'> {isExpand ? ' less' : ' more'}</button>
								</>
							)
								: (userProfile?.bio || "Bio here...")
							}</span>
							<Badge className='w-fit bg-[#f2f3f5] rounded-xl cursor-pointer hover:bg-[#e7e8eb] flex items-center mt-2 px-1' variant='secondary'><AtSign className='h-4' /><span className='pl-1'>{userProfile?.username}</span></Badge>
							<span>Learn code with Abdullah Ansari</span>
							<span>Learn code with Abdullah Ansari</span>
						</div>

					</section>

				</div>

				<div className='border-t border-t-gray-200'>
					<div className="flex items-center justify-center gap-10 text-sm">
						<span className={`py-3 cursor-pointer flex items-center ${activeTab === 'posts' ? 'font-semibold border-t border-t-slate-800' : ""}`} onClick={() => activeTabHandler('posts')}><TableCellsMerge className='h-[14px]' /> POSTS</span>
						<span className={`py-3 cursor-pointer flex items-center ${activeTab === 'reels' ? 'font-semibold border-t border-t-slate-800' : ""}`} onClick={() => activeTabHandler('reels')}><Video className='h-[14px]' /> REELS</span>
						<span className={`py-3 cursor-pointer flex items-center ${activeTab === 'saved' ? 'font-semibold border-t border-t-slate-800' : ""}`} onClick={() => activeTabHandler('saved')}><Save className='h-[14px]' /> SAVED</span>
						<span className={`py-3 cursor-pointer flex items-center ${activeTab === 'tagged' ? 'font-semibold border-t border-t-slate-800' : ""}`} onClick={() => activeTabHandler('tagged')}><Contact className='h-[14px]' /> TAGGED</span>
					</div>
				</div>

				<div className="grid grid-cols-3 gap-1 ">
					{
						displayedPost?.slice().reverse().map((post) => {
							return (
								<div key={post._id} className='relative group cursor-pointer'>
									<img src={post.image} alt="postImage" className='rounded-sm w-full aspect-square object-cover bg-top' />
									<div className='absolute rounded inset-0 flex items-center justify-center bg-slate-800 opacity-0 bg-opacity-50 group-hover:opacity-100 transition-opacity duration-300'>
										<div className="flex items-center text-center space-x-4">
											<button className='flex items-center gap-2 text-white'>
												<Heart />
												<span className='text-lg font-bold'>{post?.likes.length}</span>
											</button>
											<button className='flex items-center gap-2 text-white'>
												<MessageCircle />
												<span className='text-lg font-bold'>{post?.comments.length}</span>
											</button>
										</div>
									</div>
								</div>
							)
						})
					}
					 
				</div>

			</div>
		</div>
	)
}

export default Profile
