import React from 'react'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'


function NotificationOpen({ openNotifications, setOpenNotifications }) {
	const { likeNotification } = useSelector(store => store.realTimeNotification);


	return (
		<Sheet open={openNotifications}>
			<SheetContent onInteractOutside={() => setOpenNotifications(false)} side={"left"} className="w-[230px] sm:w-[540px] bg-white rounded-r-2xl">
				<SheetHeader>
					<SheetTitle className='font-bold text-2xl'>Notifications</SheetTitle>
					<span className='font-bold pb-3'>This month</span>
				</SheetHeader>

				{
					<div >
						{
							likeNotification.length === 0 ? (
								<div className='flex items-center justify-center'>
									<p className='text-gray-500 mt-16'>no new notification</p>
								</div>
							) : (
								<div className="h-[80vh] overflow-y-auto
									[&::-webkit-scrollbar]:w-1
									[&::-webkit-scrollbar-track]:rounded-full
									[&::-webkit-scrollbar-track]:bg-gray-100
									[&::-webkit-scrollbar-thumb]:rounded-full
									[&::-webkit-scrollbar-thumb]:bg-gray-300
									dark:[&::-webkit-scrollbar-track]:bg-neutral-700
									dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
									{likeNotification.map((notification) => {
										return (
											<Link to={`/profile/${notification?.userId}`}>
												<div onClick={() => setOpenNotifications(false)} key={notification.userId} className='flex items-center gap-2 my-2 hover:bg-gray-100 p-2 w-full'>
													{/* <Link onClick={() => setOpenNotifications(false)}> */}
													<Avatar>
														<AvatarImage src={notification.userDetails?.profilePicture} />
														<AvatarFallback>CN</AvatarFallback>
													</Avatar>
													{/* </Link> */}
													<p className='text-sm'><Link to={`/profile/${notification?.userId}`} onClick={() => setOpenNotifications(false)}><span className='font-bold'>{notification.userDetails?.username}</span></Link> liked your post</p>
												</div>
											</Link>
										)
									})}
								</div>
							)
						}
					</div>
				}

			</SheetContent>
		</Sheet>
	)
}

export default NotificationOpen
