import React, { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Bookmark, Ellipsis, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button'; 
import { FaRegHeart } from 'react-icons/fa';  
import CommentDialog from './CommentDialog';



function Post() {

	const [text, setText] = useState("");
	const [open, setOpen] = useState(false);

  
	const handlePostComment = (e) => {
		const inputText = e.target.value;
		if(inputText.trim()) {
			setText(inputText)
		} else {
			setText("")
		}
	}



	return (
		<div className='my-8 w-full max-w-sm mx-auto'>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Avatar>
						<AvatarImage src='' alt='Post_image' />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<h1>username</h1>
				</div>
				<Dialog>
					<DialogTrigger><MoreHorizontal /></DialogTrigger>
					<DialogContent className='flex flex-col items-center text-center text-sm lg:w-[28rem] w-72 bg-white border rounded-[20px] gap-0 px-0' >
						<Button variant='ghost' className=" rounded-xl text-red-500 hover:text-red-500 font-bold w-fit my-2">Report </Button><hr className='w-full color' />
						<Button variant='ghost' className=" rounded-xl text-red-500 hover:text-red-500 font-bold w-fit my-2">UnFollow </Button><hr className='w-full color' />
						<Button variant='ghost' className=" rounded-xl font-bold w-fit my-2">Add to favorites </Button><hr className='w-full color' />
						<Button variant='ghost' className=" rounded-xl font-bold w-fit my-2">go to profile</Button><hr className='w-full color' />
						<Button variant='ghost' className=" rounded-xl font-bold w-fit my-2">Share to... </Button><hr className='w-full color' />
						<Button variant='ghost' className=" rounded-xl font-bold w-fit my-2">Copy </Button><hr className='w-full color' />
						<Button variant='ghost' className=" rounded-xl font-bold w-fit mt-2 mb-0">cancel </Button>

					</DialogContent>
				</Dialog>
			</div>

			<img
				className='rounded-lg my-2 w-full object-cover aspect-square'
				src="https://images.pexels.com/photos/28406651/pexels-photo-28406651/free-photo-of-historic-armenian-church-on-akdamar-island-van.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
				alt="post_img"
			/>
			 
			<div className="flex items-center justify-between my-2">
				<div className="flex gap-3">
					<FaRegHeart className='cursor-pointer hover:text-gray-600 size-5 md:size-6' />
					<MessageCircle onClick={() => setOpen(true)} className='cursor-pointer hover:text-gray-600 size-5 md:size-6' />
					<Send className='cursor-pointer hover:text-gray-600 size-5 md:size-6' />
				</div>
				<div className="">
					<Bookmark className='cursor-pointer hover:text-gray-600 size-5 md:size-6' />
				</div>
			</div> 

			<span className='text-sm font-medium block mb-1'>34 likes</span>

			<p> 
				<span className='font-medium mr-2'>username</span>
				caption
			</p>

			<span onClick={() => setOpen(true)} className='cursor-pointer text-sm text-gray-400'>view all 100 comments</span>

			<CommentDialog open={open} setOpen={setOpen}/>

			<div className='flex items-center justify-between'>
				<input 
					type='text'
					placeholder='Add a comment...'
					value={text}
					onChange={handlePostComment}
					className='outline-none w-full text-sm'
				/>
				{
					text && <span className='text-[#3BADF8]'>Post</span>
				}
			</div>


		</div>

	)
}

export default Post
