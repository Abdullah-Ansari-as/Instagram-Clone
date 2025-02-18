import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'


function LeftSideBar() {

	const [open, setOpen] = useState(false)
	// console.log(open)

	const navigate = useNavigate()
	const { likeNotification } = useSelector(store => store.realTimeNotification)
	const { user } = useSelector(store => store.auth)
	// console.log(user)
	const dispatch = useDispatch()

	const logoutHandler = async () => {
		try {
			const res = await axios.get("http://localhost:3000/api/v1/users/logout", { withCredentials: true });
			if (res.data.success) {
				dispatch(setAuthUser(null));
				dispatch(setSelectedPost(null));
				dispatch(setPosts([]))
				navigate("/login")
				toast.success(res.data.message)
			}
		} catch (error) {
			toast.error(error.response.data.message)
		}
	}

	const sidebarHandler = (textType) => {
		if (textType === "Logout") {
			logoutHandler();
		} else if (textType === "Create") {
			setOpen(true)
		} else if (textType === "Profile") {
			navigate(`/profile/${user?._id}`);
		} else if (textType === "Home") {
			navigate('/')
		} else if (textType === "Messages") {
			navigate('/chat')
		}
	}

	const sideBarItems = [
		{ icon: <Home className='w-7 h-7' />, text: "Home" },
		{ icon: <Search className='w-7 h-7' />, text: "Search" },
		{ icon: <TrendingUp className='w-7 h-7' />, text: "Explore" },
		{ icon: <MessageCircle className='w-7 h-7' />, text: "Messages" },
		{ icon: <Heart className='w-7 h-7' />, text: "Notifications" },
		{ icon: <PlusSquare className='w-7 h-7' />, text: "Create" },
		{
			icon: (
				<Avatar className="w-6 h-6">
					<AvatarImage src={user?.profilePicture} />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
			), text: "Profile"
		},
		{ icon: <LogOut />, text: "Logout" },
	]


	return (
		<div className='sm:flex px-4 w-20 1120px:w-60 lg:w-48 shrink hidden border-r border-gray-300 h-screen fixed top-0 z-10 left-0 '>
			<div className="flex flex-col">
				{/* Picture Shown on large screens */}
				<Link to='/'><img
					className='hidden lg:block mt-5 pl-4 w-[120px]'
					src="/instaLogo.png"
					alt="Logo" /></Link>

				{/* Picture Shown on small screens */}
				<Link to='/'><img
					className='block lg:hidden lg:my-10 my-3 object-cover lg:mt-5 mt-2 lg:pl-4 md:w-[120px]'
					src="./instaLogoForSm.png"
					alt="Logo" /></Link>
				{
					sideBarItems.map((item, ind) => {
						return (
							<div onClick={() => sidebarHandler(item.text)} key={ind} className='flex items-center gap-4 my-2 relative hover:cursor-pointer hover:bg-gray-100 rounded-xl p-3'>
								<span className=''>{item.icon}</span>
								<span className='text-lg font-medium hidden lg:block'>{item.text}</span>
								{
									item.text === "Notifications" && likeNotification.length > 0 && (
										<Popover>
											<PopoverTrigger asChild>
												<Button size='icon' className='rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 text-white absolute bottom-6 left-6'>{likeNotification.length}</Button>
											</PopoverTrigger>
											<PopoverContent className='bg-white rounded'>
												<div>
													{
														likeNotification.length === 0 ? (<p>no new notification</p>) : (
															likeNotification.map((notification) => {
																return (
																	<div key={notification.userId} className='flex items-center gap-2 my-2'>
																		<Avatar>
																			<AvatarImage src={notification.userDetails?.profilePicture} />
																			<AvatarFallback>CN</AvatarFallback>
																		</Avatar>
																		<p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
																	</div>
																)
															})
														)
													}
												</div>
											</PopoverContent>
										</Popover>
									)
								}
							</div>
						)
					})
				}
			</div>
			<CreatePost open={open} setOpen={setOpen} />
		</div>
	)
}

export default LeftSideBar