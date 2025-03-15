import { Heart, LogOut, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
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
import { FaRegCompass } from "react-icons/fa6";
import { GoHome } from "react-icons/go";
import { RiMessengerLine } from "react-icons/ri";
import { TbSquareRoundedPlus } from "react-icons/tb";



function LeftSideBar() {

	const [open, setOpen] = useState(false)
	// console.log(open)
	const [searchOpen, setSearchOpen] = useState(false)
	const [openNotifications, setOpenNotifications] = useState(false)

	const [storyCircle, setStoryCircle] = useState(false)

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
			window.scrollTo({ top: 0, behavior: 'smooth' });
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
		{ icon: <GoHome className='w-7 h-7' />, text: "Home" },
		{ icon: <Search className='w-7 h-7' />, text: "Search" },
		{ icon: <FaRegCompass className='w-[25px] h-[25px]' />, text: "Explore" },
		{ icon: <RiMessengerLine className='w-7 h-7' />, text: "Messages" },
		{ icon: <Heart className='w-[26px] h-[26px]' />, text: "Notifications" },
		{ icon: <TbSquareRoundedPlus className='w-7 h-7' />, text: "Create" },
		{
			icon: (
				<div className={`${storyCircle && 'p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 rounded-full'}`}>
					<Avatar className="w-7 h-7 border-2 border-white">
						<AvatarImage src={user?.profilePicture} className='object-cover' />
						<AvatarFallback className='bg-gray-200'>CN</AvatarFallback>
					</Avatar>
				</div >
			), text: "Profile"
		},
		{ icon: <LogOut />, text: "Logout" },
	]


	const { loggedInUserStory } = useSelector(store => store.story)
	// console.log(stories)
	// console.log(loggedInUserStory)

	useEffect(() => {
		if (loggedInUserStory) {
			setStoryCircle(loggedInUserStory)
		}
	}, [loggedInUserStory])


	const [activeItem, setActiveItem] = useState("Home"); // Default active item

	const sidebarHandlerrr = (item) => {
	  setActiveItem(item); // Update active state
	};


	return (

		<div className={`
			${searchOpen || openNotifications ? "1120px:w-20  m-auto" : ""}
			fixed sm:top-0 sm:left-0 z-10 sm:h-screen sm:w-20 sm:border-r sm:border-gray-300 bg-white
			sm:flex h-10 w-full bottom-0 top-auto border-t sm:border-t-0 sm:flex-col
			lg:-w-48
			1120px:w-60
		`}>
			<div className="flex justify-center flex-row sm:flex-col">

				{/* Picture Shown on large screens */}
				<div className={`flex ${searchOpen || openNotifications ? "justify-start items-center mx-auto 1120px:m-0" : ""}`}>
					<Link to='/'>
						{
							searchOpen || openNotifications ? (
								<img
								onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
									className='block my-3 object-cover 1120px:my-4 1120px:ml-[16px] m-auto 1120px:m-0 mt-4  w-[36px]'
									src="/instaLogoForSm.png"
									alt="Logo" />
							) : (
								<img
								onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
									className='hidden 1120px:block mt-3 pl-4 w-[120px]'
									src="/instaLogo.png"
									alt="Logo" />
							)
						}
					</Link>
				</div>

				{/* Picture Shown on small screens */}
				{
					searchOpen || openNotifications ? "" : <Link to='/' className={`flex items-center justify-center ${searchOpen || openNotifications ? 'mt-2' : ''}`}><img
					onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
						className='hidden sm:block 1120px:hidden 1120px:my-3 my-3 object-cover 1120px:mt-5 mt-4 1120px:pl-4 w-[36px]'
						src="/instaLogoForSm.png"
						alt="Logo" /></Link>
				}
				{
					sideBarItems.map((item, ind) => {
						return (
							<div onClick={() => {
								sidebarHandler(item.text)
								sidebarHandlerrr(item.text)
								}} key={ind} className={`flex h-full mx-[7px] m-auto sm:mx-2 items-center justify-center 1120px:justify-start gap-4 my-2 relative hover:cursor-pointer hover:bg-gray-100 rounded-xl px-2 sm:px-3 sm:pt-3 sm:pb-2 ${["Messages", "Notifications"].includes(item.text) ? "hidden sm:flex" : ""} `}>
								<span className=''>{item.icon}</span>
								<span className={`text-lg
									 ${searchOpen || openNotifications ? 'hidden' : 'hidden 1120px:block'}
									 ${activeItem === item.text ? "font-semibold" : ""}
									 `}>{item.text}</span>
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

			<SearchOpen searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
			<NotificationOpen openNotifications={openNotifications} setOpenNotifications={setOpenNotifications} />
			<CreatePost open={open} setOpen={setOpen} />
		</div>
	)
}

export default LeftSideBar