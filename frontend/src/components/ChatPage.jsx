import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Button } from './ui/button';
import { MessageCircleCode, UserIcon } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';
import { Link } from 'react-router-dom';

function ChatPage() {
	const [textMessage, setTextMessage] = useState("")
	const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
	const { onlineUsers, messages } = useSelector(store => store.chat)
	// console.log(onlineUsers) 
	// console.log(messages)
	// console.log(selectedUser)
	const dispatch = useDispatch(); 

	const sendMessageHandler = async (receiverId) => {
		// console.log(receiverId)
		try {
			const res = await axios.post(`http://localhost:3000/api/v1/messages/send/${receiverId}`, { textMessage }, {
				headers: {
					'Content-Type': 'application/json'
				},
				withCredentials: true
			});
			// console.log(res)
			if (res.data.success) {
				// dispatch(setMessages([...messages, res.data.newMessage]));
				dispatch(setMessages([...(messages || []), res.data.newMessage]));
				setTextMessage("");
			}
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		setTextMessage("");
	}, [selectedUser?._id]);

	useEffect(() => {
		return () => {
			dispatch(setSelectedUser(null));
		}
	}, [])

	const selectedUserHandler = (user) => {
		// console.log(user)
		dispatch(setSelectedUser(user));
	}

	return (
		
		<div className='flex w-full sm:w-[89%] 1120px:w-[80%] sm:ml-20 1120px:ml-[20%] h-screen'>
			
			<section className='w-[20vw] md:w-1/4 my-8'>
				<Link to={`/profile/${user?._id}`}><h1 className='overflow-hidden font-semibold sm:font-bold mb-3 sm:mb-8 pl-1 sm:px-3 text-sm sm:text-xl'>{user?.username}</h1></Link>
				{/* <hr className='mb-4 border-gray-300' /> */}
				<div className="h-[80vh] sm:h-[80vh] overflow-y-auto
									[&::-webkit-scrollbar]:w-1
									[&::-webkit-scrollbar-track]:rounded-full
									[&::-webkit-scrollbar-track]:bg-gray-100
									[&::-webkit-scrollbar-thumb]:rounded-full
									[&::-webkit-scrollbar-thumb]:bg-gray-300
									dark:[&::-webkit-scrollbar-track]:bg-neutral-700
									dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
					{
						suggestedUsers.map((user) => {
							// console.log(user)
							const isOnline = onlineUsers.includes(user._id);
							return (
								<div onClick={() => selectedUserHandler(user)} className='flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer w-0 sm:w-60 rounded '>
									<Avatar className='lg:w-14 lg:h-14'>
										<AvatarImage src={user?.profilePicture} className='object-cover'/>
										<AvatarFallback>CN</AvatarFallback>
									</Avatar>
									<div className='460px:flex-col hidden 460px:flex'>
										<span className='font-normal'>{user?.username}</span>
										<span className={`text-xs ${isOnline ? 'text-green-600' : 'text-red-600'} `}>{isOnline ? 'online' : 'offline'}</span>
									</div>
								</div>
							)
						})
					}
				</div>
			</section>

			{
				selectedUser ? (
					<section className='flex-1 h-[93%] sm:h-full border-l border-l-gray-300 flex flex-col'>
						<div className="flex gap-3 items-center px-3 py-2 sm:py-4 border-b border-gray-300 sticky top-0 bg-white z-10">
							<Avatar>
								<AvatarImage src={selectedUser?.profilePicture} alt="profile" className='object-cover'/>
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<span className='font-semibold'>{selectedUser?.username}</span>
							</div>
						</div>
						<Messages selectedUser={selectedUser} />
						<div className="flex items-center p-[3px] sm:p-4 border-t border-t-gray-300 rounded-[10px]">
							<input value={textMessage} onChange={(e) => setTextMessage(e.target.value)} type="text" className='flex-1 mr-2 focus-visible:ring-transparent focus:outline-none focus:ring-0' placeholder='Messages...' />
							<Button className='bg-slate-400 rounded-xl p-3' onClick={() => sendMessageHandler(selectedUser?._id)}>Send</Button>
						</div>
					</section>
				) : (
					<div className='flex flex-col items-center justify-center mx-auto'>
						<MessageCircleCode className='w-20 h-20 sm:w-32 sm:h-32 my-4' />
						<h1 className='font-medium text-xl'>Your Messages</h1>
						<span>Send a message to start a chat</span>
					</div>
				)
			}

		</div>

	)
}

export default ChatPage
