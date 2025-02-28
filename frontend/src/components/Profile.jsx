import useGetUserProfile from '@/hooks/useGetUserProfile'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Contact, Heart, MessageCircle, Save, TableCellsMerge, Video } from 'lucide-react';
import { TbCameraShare } from "react-icons/tb";
import axios from 'axios';
import { toast } from 'sonner';
import { setSelectedUser } from '@/redux/authSlice';
import CommentDialog from './CommentDialog';
import { setSelectedPost } from '@/redux/postSlice';
import CreatePost from './CreatePost';
import { CiSaveDown2 } from "react-icons/ci";

function Profile() {
	const params = useParams();
	const userId = params.id;
	useGetUserProfile(userId)

	const { userProfile, user } = useSelector(store => store.auth);
	// console.log(user); 
	// console.log(userProfile);  

	const navigate = useNavigate()

	// let bioLength = userProfile.bio.length;
	const [isExpand, setIsExpand] = useState(false)

	const [activeTab, setActiveTab] = useState("posts");


	const [openCommentDialog, setOpenCommentDialog] = useState(false)
	const [open, setOpen] = useState(false)

	const isLoggedInUserProfile = user?._id === userProfile?._id;

	const dispatch = useDispatch();

	const activeTabHandler = (tab) => {
		setActiveTab(tab)
	}

	const expandBioHandler = () => {
		setIsExpand(!isExpand)
	}

	const displayedPost = activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks
	console.log(displayedPost)


	const [isFollowing, setIsFollowing] = useState(false)
	useEffect(() => {
		setIsFollowing(userProfile.followers.includes(user?._id))
	}, [userProfile.followers, user])

	const followUnfollowHandler = async () => {
		setIsFollowing((prev) => !prev)
		try {
			const res = await axios.post(`http://localhost:3000/api/v1/users/followorUnfollow/${userProfile?._id}`, {}, { withCredentials: true });
			// console.log(res) 
			if (res.data.success) {
				toast.success(res.data.message);
			}
		} catch (error) {
			console.log(error)
		}
	}

	const messageHandler = (userProfile) => {
		dispatch(setSelectedUser(userProfile))
		navigate("/chat")
	}


	return (
		<div className='flex w-[67rem] mx-auto pl-20'>
			<div className="flex w-[67rem] flex-col gap-10 pl-20 py-8 ">

				<div className='grid grid-cols-2'>

					<section className='flex items-center justify-center'>
						<Avatar className='h-40 w-40 mr-10'>
							<AvatarImage className='object-cover' src={userProfile?.profilePicture} alt="profile_Photo" />
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
												<Button onClick={followUnfollowHandler} variant='secondary' className='bg-[#eeeded] hover:bg-[#dbdbdb] h-8 rounded'>Unfollow</Button>
												<Button onClick={() => messageHandler(userProfile)} variant='secondary' className='bg-[#eeeded] hover:bg-[#dbdbdb] h-8 rounded'>Message</Button>
											</>
										) : (
											<>
												<Button onClick={followUnfollowHandler} className='bg-[#0095f6] hover:bg-[#0e80cc] h-8 rounded ml-6'>Follow</Button>
												<Button onClick={() => messageHandler(userProfile)} variant='secondary' className='bg-[#eeeded] hover:bg-[#dbdbdb] h-8 rounded'>Message</Button>
											</>
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
						{
							user?._id === userProfile?._id && <span className={`py-3 cursor-pointer flex items-center ${activeTab === 'saved' ? 'font-semibold border-t border-t-slate-800' : ""}`} onClick={() => activeTabHandler('saved')}><Save className='h-[14px]' /> SAVED</span>
						}
						<span className='py-3 flex items-center'><Video className='h-[14px]' /> REELS</span>
						<span className='py-3 flex items-center'><Contact className='h-[14px]' /> TAGGED</span>
					</div>
				</div>


				{
					displayedPost.length > 0 ?
						(
							<div className="grid grid-cols-3 gap-1 ">
								{displayedPost?.slice().reverse().map((post) => {
									// console.log(post) 
									return (
										<div key={post._id} className='relative group cursor-pointer' onClick={() => {
											dispatch(setSelectedPost(post))
											setOpenCommentDialog(true)
										}}>
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
								})}
								<CommentDialog openCommentDialog={openCommentDialog} setOpenCommentDialog={setOpenCommentDialog} />
							</div>
						) : (
							<div className='flex justify-center items-center flex-col m-auto'>
								{user?._id === userProfile?._id && activeTab?.toLowerCase() === 'posts' ? (
									<>
										<button
											onClick={() => setOpen(true)}
											className="flex flex-col items-center space-y-3"
										>
											<div className="my-5 bg-gray-100 rounded-full p-4 hover:bg-gray-200 transition">
												<TbCameraShare className="h-16 w-16 text-gray-600" />
											</div>
										</button>
										<h1 className="text-2xl font-extrabold text-gray-800">Share Photos</h1>
										<p className="text-sm text-gray-500 my-2">When you share photos, they will appear on your profile.</p>
										<span onClick={() => setOpen(true)} className="text-md font-semibold cursor-pointer text-blue-500 hover:underline">See your first photo</span>

									</>
								) : (
									activeTab?.toLowerCase() === 'saved' ? (
										<>
											<div className='flex justify-start place-self-start'>
												<p className='text-gray-600 text-xs mb-7'>Only you can see what you've saved</p>
											</div>
											<CiSaveDown2 className="h-14 w-14 text-gray-600 mb-3" />
											<h1 className="text-3xl font-extrabold text-gray-800">Save</h1>
											<p className='text-slate-800 text-sm mb-8 mt-3'>Save photos and videos that you want to see again. No<br /> one is notified, and only you can see what you've saved.</p>
										</>
									) : (
										<>
											<div className="my-5">
												<TbCameraShare className="h-16 w-16 text-gray-500" />
											</div>
											<h1 className="text-2xl font-extrabold text-gray-800">No Posts Yet</h1>
										</>
									)
								)}
								<CreatePost open={open} setOpen={setOpen} />

								<div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#695e69] mt-16 mb-4">
									<span>Meta</span>
									<span>About</span>
									<span>Blog</span>
									<span>Jobs</span>
									<span>Help</span>
									<span>API</span>
									<span>Privacy</span>
									<span>Terms</span>
									<span>Locations</span>
									<span>Instagram Lite</span>
									<span>Threads</span>
									<span>Contact Uploading & Non-Users</span>
									<span>Meta Verified</span>
								</div>
								<div className='text-xs text-[#695e69] mb-7'>English  © 2025 Instagram from Meta</div>
								{/* <input type="text" /> */}
							</div>
						)
				}



			</div>
		</div>
	)
}

export default Profile
