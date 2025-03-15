import React, { useState } from 'react'
import Posts from './Posts'
import { Heart } from 'lucide-react'
import { RiMessengerLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import NotificationOpen from './NotificationOpen';
import { useSelector } from 'react-redux'; 


function Feed() {

	const { likeNotification } = useSelector(store => store.realTimeNotification)

	const navigate = useNavigate();
	const [openNotifications, setOpenNotifications] = useState(false);


	return (
		<div className='flex-1 flex flex-col items-center lg:pl-[20%]'>

			<div className='flex items-center justify-between w-full relative right-0 sm:hidden'>
				<div onClick={() => navigate('/')}>
					<img
						className='pl-2 h-14 w-[120px]'
						src="/instaLogo.png"
						alt="Logo" />
				</div>
				<div className='flex gap-3 mr-2'>

					<div className="relative">
						{/* Messenger Icon */}
						<Heart onClick={() => setOpenNotifications(true)} className='w-[30px] h-[30px]' />

						{/* Notification Badge */}
						{likeNotification.length > 0 && (
							<div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
								{likeNotification.length}
							</div>
						)}
					</div>
					<RiMessengerLine onClick={() => navigate('/chat')} className='w-[30px] h-[30px]' />

				</div>


				<NotificationOpen openNotifications={openNotifications} setOpenNotifications={setOpenNotifications} />



			</div>

			<Posts />
		</div>
	)
}

export default Feed
