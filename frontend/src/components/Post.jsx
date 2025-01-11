import React from 'react'
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Bookmark, Ellipsis, MessageCircle, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { FaRegHeart } from "react-icons/fa";


function Post() {
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
					<DialogTrigger><Ellipsis /></DialogTrigger>
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
			
			<div className="">
				<div className="flex items-center justify-between my-2">
					<div className="flex gap-2 h-4 w-4">
						<FaRegHeart size={'24px'} className='cursor-pointer hover:text-gray-600' />
						<MessageCircle size={'24px'} className='cursor-pointer hover:text-gray-600' />
						<Send size={'24px'} className='cursor-pointer hover:text-gray-600' />
					</div>
					<div className="">
						<Bookmark size={'24px'} className='cursor-pointer hover:text-gray-600' />
					</div>
				</div>
			</div>

		</div>

	)
}

export default Post
