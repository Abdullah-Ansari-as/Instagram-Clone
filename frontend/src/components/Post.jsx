import React, { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import CommentDialog from './CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setPosts, setSelectedPost } from '@/redux/postSlice';



function Post({ post }) {
	// console.log(post)


	const { user } = useSelector(store => store.auth);
	// console.log(user)
	const { posts } = useSelector(store => store.post);
	// console.log(posts)

	const dispatch = useDispatch()

	const [text, setText] = useState("");
	const [open, setOpen] = useState(false);
	const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
	const [postLike, setPostLike] = useState(post.likes.length);
	const [isAnimating, setIsAnimating] = useState(false);
	const [comment, setComment] = useState(post.comments)
	// console.log(comment.length)

	const handlePostComment = (e) => {
		const inputText = e.target.value;
		if (inputText.trim()) {
			setText(inputText)
		} else {
			setText("")
		}
	}

	const timestamp = new Date(post.createdAt);
	// Options for formatting
	const options = { day: '2-digit', month: 'short' };
	// Format the date
	const formattedDate = timestamp.toLocaleDateString('en-US', options);
	// console.log(formattedDate)


	const deletePostHandler = async () => {
		try {
			const res = await axios.delete(`http://localhost:3000/api/v1/posts/delete/${post?._id}`, { withCredentials: true })
			if (res.data.success) {
				const updatedPosts = posts.filter((postItem) => postItem?._id !== post?._id)
				// console.log(updatedPosts)
				dispatch(setPosts(updatedPosts))
				toast.success(res.data.message);
			}
		} catch (error) {
			console.log(error)
			toast.error(error.response.data.message)
		}
	}

	const likeDisLikHandler = async () => {
		try {
			setIsAnimating(true);
			const action = liked ? "dislike" : "like"
			const res = await axios.get(`http://localhost:3000/api/v1/posts/${post._id}/${action}`, { withCredentials: true });
			if (res.data.success) {
				const updatedLikes = liked ? postLike - 1 : postLike + 1
				setPostLike(updatedLikes)
				setLiked(!liked);

				// updated post data
				const updatedPostData = posts.map((p) => {
					return (
						// console.log(p)
						p._id === post._id ? {
							...p, // set all previous post data
							likes: liked ? p.likes.filter(id => id !== user?._id) : [...p.likes, user._id]
						} : p
					)
				})
				// console.log(updatedPostData)
				dispatch(setPosts(updatedPostData));
				setTimeout(() => setIsAnimating(false), 500); // Reset animation after 500ms
				toast.success(res.data.message)
			}
		} catch (error) {
			console.log(error)
		}
	}

	const commentHandler = async () => {
		try {
			const res = await axios.post(`http://localhost:3000/api/v1/posts/${post._id}/comment`, { text }, {
				headers: {
					'Content-Type': 'application/json'
				},
				withCredentials: true
			});
			// console.log(res.data);
			if (res.data.success) {
				const updatedCommentData = [...comment, res.data.comment];
				setComment(updatedCommentData);

				const updatedPostData = posts.map(p =>
					p._id === post._id ? { ...p, comments: updatedCommentData } : p
				);

				dispatch(setPosts(updatedPostData));
				toast.success(res.data.message);
				setText("");
			}
		} catch (error) {
			console.log(error);
		}
	}


	return (
		<div className='my-8 w-full max-w-sm mx-auto'>
			<div className="flex items-center justify-between mx-3 640px:mx-0">
				<div className="flex items-center gap-2">
					<Avatar>
						<AvatarImage src={post.author?.profilePicture} alt='Post_image' />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<div className='flex items-center gap-2'>
						<h1>{post.author?.username}</h1>
						<span className='text-sm text-gray-400'>{formattedDate}</span>
						{user._id === post.author._id && <Badge className='bg-[#f2f3f5] rounded-xl' variant="secondary">Author</Badge>}
					</div>
				</div>

				<Dialog >
					<DialogTrigger><MoreHorizontal /></DialogTrigger>

					<DialogContent className='flex flex-col items-center text-center text-sm lg:w-[28rem] w-72 bg-white border rounded-[20px] gap-0 px-0' >
						{
							user && user?._id !== post.author?._id && (
								<>
									<Button variant='ghost' className=" rounded-xl text-red-500 hover:text-red-500 font-bold w-fit my-2">Report </Button><hr className='w-full ' />
									<Button variant='ghost' className=" rounded-xl text-red-500 hover:text-red-500 font-bold w-fit my-2">UnFollow </Button><hr className='w-full ' />
								</>
							)
						}

						{
							user && user?._id === post.author?._id && (
								<>
									<Button variant='ghost' className=" rounded-xl text-red-500 hover:text-red-500 font-bold w-fit mt-2 mb-0" onClick={deletePostHandler}>Delete </Button><hr className='w-full' />
									<Button variant='ghost' className=" rounded-xl font-bold w-fit my-2">Edit</Button><hr className='w-full ' />
								</>
							)
						}
						<Button variant='ghost' className=" rounded-xl font-bold w-fit my-2">Add to favorites </Button><hr className='w-full ' />
						<Button variant='ghost' className=" rounded-xl font-bold w-fit my-2">Go to post</Button><hr className='w-full ' />
						<Button variant='ghost' className=" rounded-xl font-bold w-fit my-2">About this account</Button>
					</DialogContent>

				</Dialog>

			</div>

			<img
				className='rounded-lg my-2 w-full object-cover bg-top aspect-square'
				src={post.image}
				alt="post_img"
			/>

			<div className="mx-4 640px:mx-0">

				<div className="flex items-center justify-between my-2">
					<div className="flex gap-3">
						{
							liked ? <FaHeart onClick={likeDisLikHandler} className={`cursor-pointer text-red-600 size-5 md:size-6 ${isAnimating ? 'animate-heartBeat' : ''}`} /> : <FaRegHeart onClick={likeDisLikHandler} className='cursor-pointer hover:text-gray-600 size-5 md:size-6' />
						}

						<MessageCircle onClick={() => {
							dispatch(setSelectedPost(post))
							setOpen(true)
						}} className='cursor-pointer hover:text-gray-600 size-5 md:size-6' />
						<Send className='cursor-pointer hover:text-gray-600 size-5 md:size-6' />
					</div>
					<div className="">
						<Bookmark className='cursor-pointer hover:text-gray-600 size-5 md:size-6' />
					</div>
				</div>

				<span className='text-sm font-medium block mb-1'>{postLike} likes</span>

				<p>
					<span className='font-medium mr-2'>{post.author?.username}</span>
					{post.caption}
				</p>

				{
					comment.length > 0 && <span onClick={() => {
						dispatch(setSelectedPost(post))
						setOpen(true)
					}} className='cursor-pointer text-sm text-gray-400'>view all {comment.length} comments</span>
				}

				<CommentDialog open={open} setOpen={setOpen} />

				<div className='flex items-center justify-between'>
					<input
						type='text'
						placeholder='Add a comment...'
						value={text}
						onChange={handlePostComment}
						className='outline-none w-full text-sm'
					/>
					{
						text && <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer'>Post</span>
					}
				</div>
			</div>

		</div>

	)
}

export default Post
