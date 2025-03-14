import React, { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useSelector } from 'react-redux'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'

function Messages({ selectedUser }) {
	useGetRTM();
	useGetAllMessage();
	const { messages } = useSelector(store => store.chat);
	// console.log(messages)
	const { user } = useSelector(store => store.auth);

	const messagesEndRef = useRef(null);

	useEffect(() => {
		// Scroll to the last message when messages update
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		// <div className='overflow-y-auto flex-1 p-4 w-[225px] sm:w-[100px] md:w-[150px] lg:w-[200px] xl:w-[250px] transition-all duration-300 '>
		// <div className=' w-full overflow-y-auto bg-slate-400 flex-1 p-4 460px:w-[326px] 500px:w-[361px] 545px:w-[422px] 640px:w-[430px] transition-all duration-300 '>
		<div className=' w-full overflow-y-auto flex-1 p-[3px] sm:p-4 '>
			<div className="flex justify-center">
				<div className='flex flex-col items-center justify-center'>
					<Avatar className='h-24 w-24 mt-2'>
						<AvatarImage className='object-cover' src={selectedUser?.profilePicture} alt='profile' />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<span className='mt-2 text-sm sm:text-base'>{selectedUser?.username}</span>
					<Link to={`/profile/${selectedUser?._id}`}><Button className="h-8 my-2 text-sm sm:text-base bg-[#eeeded] hover:bg-[#dbdbdb] rounded" variant="secondary">view Profile</Button></Link>
				</div>
			</div>

			<div className='flex flex-col gap-3'>
				{
					messages && messages.map((msg) => {
						// console.log(msg)
						return (
							<div key={msg?._id} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
								<div className={`p-2 rounded-xl max-w-[12rem] sm:max-w-xs break-words text-sm sm:text-base ${msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
									{msg.message}
								</div>
							</div>
						)
					})
				}
			</div>

			{/* 🔽 Empty div at the bottom to auto-scroll */}
			<div ref={messagesEndRef} />

		</div>
	)
}

export default Messages
