import React from 'react'
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
	const {user} = useSelector(store => store.auth);

	return (
		<div className='overflow-y-auto flex-1 p-4'>
			<div className="flex justify-center">
				<div className='flex flex-col items-center justify-center'>
					<Avatar className='h-24 w-24 mt-2'>
						<AvatarImage src={selectedUser?.profilePicture} alt='profile' />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<span className='mt-2'>{selectedUser?.username}</span>
					<Link to={`/profile/${selectedUser?._id}`}><Button className="h-8 my-2 bg-[#eeeded] hover:bg-[#dbdbdb] rounded" variant="secondary">view Profile</Button></Link>
				</div>
			</div>

			<div className='flex flex-col gap-3'>
				{
					messages && messages.map((msg) => {
						// console.log(msg)
						return (
							<div key={msg?._id} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
								<div className={`p-2 rounded-xl max-w-xs break-words ${msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
									{msg.message}
								</div>
							</div>
						)
					})
				}
			</div>
		</div>
	)
}

export default Messages
