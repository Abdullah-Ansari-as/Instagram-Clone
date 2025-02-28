import { Heart, Home, LogOut, MessageCircle, Search, PlusSquare, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { toast } from 'sonner'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice' 
import { Button } from './ui/button';
import SearchOpen from './SearchOpen'
import NotificationOpen from './NotificationOpen'
import { setLikeNotification } from '@/redux/RealTimeNotif'


function LeftSideBar() {

	const [open, setOpen] = useState(false)
	// console.log(open)
	const [searchOpen, setSearchOpen] = useState(false)
	const [openNotifications, setOpenNotifications] = useState(false)

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
				dispatch(setLikeNotification([]));
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
		} else if (textType === "Search") {
			setSearchOpen(true)
		} else if (textType === "Notifications") {
			setOpenNotifications(true)
		} else if (textType === "Explore") {
			navigate('/explore/')
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
				<div className={`flex ${searchOpen || openNotifications ? "justify-center items-center" : ""}`}>
					<Link to='/'>
						{
							searchOpen || openNotifications ? (
								<img
									className='block lg:my-3 my-3 object-cover lg:mt-5 mt-4 md:w-[40px] '
									src="/instaLogoForSm.png"
									alt="Logo" />
							) : ( 
								<img
									className='hidden lg:block mt-3 pl-4 w-[120px]'
									src="/instaLogo.png"
									alt="Logo" />
							)
						}
					</Link>
				</div>

				{/* Picture Shown on small screens */}
				{
					searchOpen || openNotifications ? "" : <Link to='/' className={`flex items-center justify-center ${ searchOpen || openNotifications ? 'mt-2' : ''}`}><img
							className='block lg:hidden lg:my-3 my-3 object-cover lg:mt-5 mt-4 lg:pl-4 md:w-[40px]'
							src="/instaLogoForSm.png"
							alt="Logo" /></Link>
				}
				{
					sideBarItems.map((item, ind) => {
						return (
							<div onClick={() => sidebarHandler(item.text)} key={ind} className='flex items-center gap-4 my-2  relative hover:cursor-pointer hover:bg-gray-100 rounded-xl p-3'>
								<span className=''>{item.icon}</span>
								<span className={`text-lg font-medium ${searchOpen || openNotifications ? 'hidden' : 'hidden lg:block'}`}>{item.text}</span>
								{
									item.text === "Notifications" && likeNotification.length > 0 && (
										<Button size='icon' className='rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 text-white absolute bottom-6 left-6'>{likeNotification.length}</Button>
									)
								}
							</div>
						)
					})
				}
			</div>
			{
				searchOpen || openNotifications ? <div className="h-full w-[1px] bg-gray-300 ml-[10px]"></div> : ""
			}

			<SearchOpen searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
			<NotificationOpen openNotifications={openNotifications} setOpenNotifications={setOpenNotifications} />
			<CreatePost open={open} setOpen={setOpen} />
		</div>
	)
}

export default LeftSideBar