import useGetUserProfile from '@/hooks/useGetUserProfile'
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Contact, Heart, Loader2, MessageCircle, Save, TableCellsMerge, Video } from 'lucide-react';
import { TbCameraShare } from "react-icons/tb";
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthUser, setSelectedUser, setUserProfile } from '@/redux/authSlice';
import CommentDialog from './CommentDialog';
import { setSelectedPost } from '@/redux/postSlice';
import CreatePost from './CreatePost';
import { CiSaveDown2 } from "react-icons/ci";
import { FaCamera } from "react-icons/fa";
import OpenFollowersList from './OpenFollowersList'; 
import OpenFollowingList from './OpenFollowingList';


function Profile() {
	const params = useParams();
	const userId = params.id;
	useGetUserProfile(userId)

	const { userProfile, user } = useSelector(store => store.auth);
	// console.log(user); 
	// console.log(userProfile);   
	const [loadingProfile, setLoadingProfile] = useState(true)
	useEffect(() => {
		if (userProfile) {
			setLoadingProfile(false)
		}
	}, [userProfile?._id, userId])

	const navigate = useNavigate()

	const [isExpand, setIsExpand] = useState(false)

	const [activeTab, setActiveTab] = useState("posts");

	const [loading, setLoading] = useState(false);

	const [storyCircle, setStoryCircle] = useState(false)


	const [openCommentDialog, setOpenCommentDialog] = useState(false)
	const [open, setOpen] = useState(false)

	const isLoggedInUserProfile = user?._id === userProfile?._id;

	const dispatch = useDispatch();
	const pictureRef = useRef();

	const activeTabHandler = (tab) => {
		setActiveTab(tab)
	}

	const expandBioHandler = () => {
		setIsExpand(!isExpand)
	}

	const displayedPost = activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks
	// console.log(displayedPost)


	// follow or Unfollow logic
	const [isFollowing, setIsFollowing] = useState(false)
	useEffect(() => {
		setIsFollowing(userProfile?.followers.includes(user?._id))
	}, [userProfile?.followers, user])

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
	};

	const handleSeeAllUsers = () => {
		navigate('/explore/suggested-users')
	}

	const { loggedInUserStory } = useSelector(store => store.story)
	// console.log(stories)
	// console.log(loggedInUserStory)

	useEffect(() => {
		if (loggedInUserStory) {
			setStoryCircle(loggedInUserStory)
		}
	}, [loggedInUserStory])

	const fileChangeHandler = async (e) => {
		const file = e.target.files?.[0];
		// console.log(file)
		// if (file) setProfilePicture(file);

		// upload file
		const formData = new FormData();
		if (file) formData.append("profilePicture", file);

		try {
			setLoading(true)
			const res = await axios.post(`http://localhost:3000/api/v1/users/upload/profilePicture`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				withCredentials: true
			});

			// console.log(res)

			if (res.data.success) {
				toast.success(res.data.message);
				dispatch(setUserProfile({ ...res.data.data, profilePicture: res.data.data.profilePicture }))
				dispatch(setAuthUser({ ...res.data.data, profilePicture: res.data.data.profilePicture }))
				setLoading(false);
			}
		} catch (error) {
			console.error("Error uploading file:", error);
		} finally {
			setLoading(false)
		}
	};


	const [openFollowers, setOpenFollowers] = useState(false);
	const [openFollowing, setOpenFollowing] = useState(false);
	// console.log(openFollowers)

	useEffect(() => {
		setOpenFollowers(false);
		setOpenFollowing(false)
	}, [])

	if (loadingProfile) return <div className='flex h-screen justify-center items-center'><Loader2 className=' h-12 w-12 animate-spin' /></div>

	return ( 
		<div className='flex w-full max-w-[67rem] mx-auto mt-2 1120px:pl-20
  1251px:w-[67rem] 1175px:w-[62rem] 1120px:w-[57rem] lg:w-[52rem] 900px:w-[45rem] 800px:w-[39rem] md:w-[34rem] sm:w-[30rem]'>

			<div className="w-full flex flex-col gap-7 md:gap-6 p-0 1120px:pl-20 pb-12 sm:py-8 "> 

				

				<div className='grid grid-cols-2 md:mb-8 mb-0'>

					<section className="flex items-center ml-2 460px:ml-14 sm:ml-0 justify-start sm:justify-center relative ">
						{
							isLoggedInUserProfile && userProfile?.profilePicture === "" &&
							<input ref={pictureRef} onChange={fileChangeHandler} type='file' className='hidden' accept="image/*" />
						}

						{
							loading ? (
								<Loader2 className=' h-12 w-12 animate-spin' />
							) : (
								<Avatar
									className={`h-28 w-28 545px:h-32 545px:w-32 sm:h-40 sm:w-40 mr-0 sm:mr-10 relative ${isLoggedInUserProfile && storyCircle &&
										"p-[3px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 rounded-full"
										}`}
									onClick={isLoggedInUserProfile && userProfile?.profilePicture === "" ? () => pictureRef.current.click() : undefined}
								>
									<AvatarImage
										className="border-2 border-white object-cover rounded-full"
										src={userProfile?.profilePicture}
										alt="profile_Photo"
									/>

									{user && userProfile.profilePicture === "" && (
										isLoggedInUserProfile ? (
											<div className={`absolute inset-0 p-3 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-full cursor-pointer " title='upload your profile picture`}>
												<FaCamera className="text-white text-4xl" />
											</div>
										) : (
											<div className={`absolute inset-0 flex items-center justify-center bg-gray-300 rounded-full " title='upload your profile picture`}>
												<AvatarFallback >CN</AvatarFallback>
											</div>
										)
									)}

								</Avatar>
							)
						}

					</section>


					<section className='w-[12rem] sm:w-[20rem] md:[25rem] relative right-8 460px:right-0'>
						<div className="flex flex-col gap-3 mt-2">
							<div className='flex items-center gap-2'>
								<span className='text-lg font-semibold'>{userProfile?.username}</span>
								{
									isLoggedInUserProfile ? (
										<>
											<Link to="/account/edit"><Button variant='secondary' className='bg-[#eeeded] hover:bg-[#dbdbdb] h-8 rounded-xl hidden sm:flex'>Edit profile</Button></Link>
											<Button variant='secondary' className='bg-[#eeeded] hover:bg-[#dbdbdb] h-8 rounded-xl hidden sm:flex'>View archive</Button>
											<Button variant='secondary' className='bg-[#eeeded] hover:bg-[#dbdbdb] h-8 rounded-xl hidden 860px:flex '>Ad tools</Button>
										</>
									) : (
										isFollowing ? (
											<>
												<Button onClick={followUnfollowHandler} variant='secondary' className='bg-[#eeeded] hover:bg-[#dbdbdb] h-8 text-xs sm:text-base rounded sm:ml-6 w-[60px] sm:w-auto'>Unfollow</Button>
												<Button onClick={() => messageHandler(userProfile)} variant='secondary' className='bg-[#eeeded] hover:bg-[#dbdbdb] h-8 text-xs sm:text-base  rounded w-[60px] sm:w-auto'>Message</Button>
											</>
										) : (
											<>
												<Button onClick={followUnfollowHandler} className='bg-[#0095f6] hover:bg-[#0e80cc] h-8 text-xs sm:text-base  rounded ml-1 sm:ml-6 w-[60px] sm:w-auto'>Follow</Button>
												<Button onClick={() => messageHandler(userProfile)} variant='secondary' className='bg-[#eeeded] hover:bg-[#dbdbdb] h-8 text-xs sm:text-base  rounded w-[60px] sm:w-auto'>Message</Button>
											</>
										)

									)
								}
							</div>

							<div className='flex items-center gap-5 sm:gap-7 mt-3 mb-1'>
								<p className="text-sm sm:text-base sm:flex"> <div className="font-semibold flex items-center justify-center sm:items-start sm:justify-start sm:flex-row mr-1">{userProfile?.posts.length}</div>posts</p>
								<p className='cursor-pointer text-sm sm:text-base sm:flex' onClick={() => setOpenFollowers(true)}> <span className='font-semibold flex items-center justify-center sm:items-start sm:justify-start sm:flex-row mr-1'>{userProfile?.followers?.length}</span> followers</p>
								<p className='cursor-pointer text-sm sm:text-base sm:flex' onClick={() => setOpenFollowing(true)}> <span className='font-semibold flex items-center justify-center sm:items-start sm:justify-start sm:flex-row mr-1'>{userProfile?.following?.length}</span> following</p>
							</div>
						</div>

						<div className="flex flex-col gap-1">
							<span className="font-normal text-sm sm:text-base w-48 sm:w-[26rem] sm:font-medium mt-4 h-10">{userProfile?.bio?.length > 30 ? (
								<>
									{isExpand ? userProfile?.bio : userProfile?.bio.slice(0, 30) + '... '}
									<button onClick={expandBioHandler} className='text-gray-400 text-sm'> {isExpand ? ' less' : ' more'}</button>
								</>
							)
								: (userProfile?.bio || "Bio here...")
							}</span>
							<Badge className='w-fit bg-[#f2f3f5] rounded-xl cursor-pointer hover:bg-[#e7e8eb] flex items-center mt-2 pl-1 pr-5' variant='secondary'><AtSign className='h-4' /><span className='pl-1'>{userProfile?.username}</span></Badge>

						</div>

					</section>

				</div>


				<div className='flex gap-3 items-center justify-center'>
					<Link to="/account/edit"><Button variant='secondary' className='w-28 text-xs 460px:text-base bg-[#eeeded] hover:bg-[#dbdbdb] h-8 rounded-xl sm:hidden flex'>Edit profile</Button></Link>
					<Button variant='secondary' className='w-28 text-xs 460px:text-base bg-[#eeeded] hover:bg-[#dbdbdb] h-8 rounded-xl sm:hidden flex'>View archive</Button>
					<span className='text-xs text-black sm:hidden flex' onClick={handleSeeAllUsers}>See All</span>
				</div>


				<div className='border-t border-t-gray-200'>
					<div className="flex items-center justify-center gap-3 sm:gap-10 text-sm">
						<span className={`py-3 text-xs 460px:text-base cursor-pointer flex items-center ${activeTab === 'posts' ? 'font-semibold border-t border-t-slate-800' : ""}`} onClick={() => activeTabHandler('posts')}><TableCellsMerge className='h-[14px]' /> POSTS</span>
						{
							user?._id === userProfile?._id && <span className={`py-3 text-xs 460px:text-base cursor-pointer flex items-center ${activeTab === 'saved' ? 'font-semibold border-t border-t-slate-800' : ""}`} onClick={() => activeTabHandler('saved')}><Save className='h-[14px]' /> SAVED</span>
						}
						<span className='py-3 text-xs 460px:text-base flex items-center'><Video className='h-[14px]' /> REELS</span>
						<span className='py-3 text-xs 460px:text-base flex items-center'><Contact className='h-[14px]' /> TAGGED</span>
					</div>
				</div>


				{
					displayedPost?.length > 0 ?
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
												<div className="hidden sm:flex  items-center text-center space-x-4">
													<button className='flex items-center gap-2 text-white'>
														<Heart />
														<span className='text-lg font-bold'>{post?.likes?.length}</span>
													</button>
													<button className='flex items-center gap-2 text-white'>
														<MessageCircle />
														<span className='text-lg font-bold'>{post?.comments?.length}</span>
													</button>
												</div>
											</div>
										</div>
									)
								})}
								<CommentDialog openCommentDialog={openCommentDialog} setOpenCommentDialog={setOpenCommentDialog} isFollowing={isFollowing} followUnfollowHandler={followUnfollowHandler} />
							</div>
						) : (
							<div className='flex justify-center items-center flex-col m-auto'>
								{isLoggedInUserProfile && activeTab?.toLowerCase() === 'posts' ? (
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
										<p className="text-sm text-gray-500 my-2 mx-8 sm:mx-0">When you share photos, they will appear on your profile.</p>
										<span onClick={() => setOpen(true)} className="text-md font-semibold cursor-pointer text-blue-500 hover:underline">See your first photo</span>

									</>
								) : (
									activeTab?.toLowerCase() === 'saved' ? (
										<>
											<div className='flex justify-start place-self-center sm:place-self-start '>
												<p className='text-gray-600 text-xs mb-7'>Only you can see what you've saved</p>
											</div>
											<CiSaveDown2 className="h-14 w-14 text-gray-600 mb-3" />
											<h1 className="text-3xl font-extrabold text-gray-800">Save</h1>
											<p className='text-slate-800 text-sm mb-8 mt-3 mx-8 sm:mx-0'>Save photos and videos that you want to see again. No<br /> one is notified, and only you can see what you've saved.</p>
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
								{/* <OpenFollowersList openFollowers={openFollowers} setOpenFollowers={setOpenFollowers}/> */}


								<div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-2 text-xs text-[#695e69] mt-16 mb-4">
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
			<OpenFollowersList openFollowers={openFollowers} setOpenFollowers={setOpenFollowers} />
			<OpenFollowingList openFollowing={openFollowing} setOpenFollowing={setOpenFollowing} />
		</div>
	)
}

export default Profile
