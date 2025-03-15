import React, { useEffect, useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import CommentDialog from './CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import { Link } from 'react-router-dom';



function Post({ post }) {
	// console.log(post)


	const { user } = useSelector(store => store.auth);
	// console.log(user)
	const { posts } = useSelector(store => store.post);
	// console.log(posts)
	// const { suggestedUsers } = useSelector(store => store.auth);
	// console.log(suggestedUsers)

	const { stories } = useSelector(store => store.story);

	const dispatch = useDispatch()

	const [text, setText] = useState("");
	const [openCommentDialog, setOpenCommentDialog] = useState(false);
	const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
	const [postLike, setPostLike] = useState(post.likes.length);
	const [isAnimating, setIsAnimating] = useState(false);
	const [comment, setComment] = useState(post.comments);
	// console.log(comment.length)
	const [isBookMarked, setIsBookMarked] = useState(false)
	const [isFollowing, setIsFollowing] = useState(false);
	const [storyCircle, setStoryCircle] = useState(false)

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
		// console.log(post._id)
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

	const bookmarkHandler = async () => {
		try {
			const res = await axios.get(`http://localhost:3000/api/v1/posts/${post?._id}/bookmark`, { withCredentials: true });
			if (res.data.success) {
				setIsBookMarked(!isBookMarked)
				toast.success(res.data.message);
			}
		} catch (error) {
			console.log(error)
		}
	}



	useEffect(() => {
		setIsFollowing(post?.author.followers.includes(user?._id))
	}, [post?.author.followers, user])

	const followUnfollowHandler = async () => {
		setIsFollowing((prev) => !prev)
		try {
			const res = await axios.post(`http://localhost:3000/api/v1/users/followorUnfollow/${post?.author._id}`, {}, { withCredentials: true });
			// console.log(res) 
			if (res.data.success) {
				toast.success(res.data.message);
			}
		} catch (error) {
			console.log(error)
		}
	}

	const isUploadedStory = stories?.some(story => story.author._id === user?._id);

	const { loggedInUserStory } = useSelector(store => store.story)
	// console.log(stories)
	// console.log(loggedInUserStory)

	useEffect(() => {
		if (loggedInUserStory) {
			setStoryCircle(loggedInUserStory)
		}
	}, [loggedInUserStory])


	return (


		<div className='my-4 w-full max-w-sm mx-auto mb-10' onClick={() =>dispatch(setSelectedPost(post))}>
			<div className="flex items-center justify-between mx-2 640px:mx-0">
				<div className="flex items-center gap-2">

					<Link to={`/profile/${post.author?._id}`}>
						<div className={`${isUploadedStory && post?.author?._id === user?._id && (storyCircle && 'p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 rounded-full')}`}>
							<Avatar className='w-11 h-11'>
								<AvatarImage className='object-cover border-2 border-white rounded-full' src={post.author?.profilePicture} alt='Post_image' />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
						</div>
					</Link>

					<div className='flex items-center gap-2'>
						<Link to={`/profile/${post.author?._id}`}><h1>{post.author?.username}  </h1></Link>
						<span className='text-sm text-gray-400'>{formattedDate}</span> 
						{user._id === post.author._id ? (
							<Badge className='bg-[#f2f3f5] rounded-xl' variant="secondary">Author</Badge>
						) : (
							<span onClick={followUnfollowHandler} className={`text-xs text-[#3BADF8] font-bold cursor-pointer hover:text-[#2a8aca] ml-2 ${isFollowing ? "text-[#424242] hover:text-[#353434]" : ""}`}>
								{isFollowing ? 'Unfollow' : 'Follow'}
							</span>
						)}
					</div>
				</div>

				<Dialog >
					<DialogTrigger><MoreHorizontal /></DialogTrigger>

					<DialogContent className='flex flex-col items-center text-center text-sm lg:w-[28rem] w-72 bg-white border rounded-[20px] gap-0 px-0' >
						{
							user && user?._id !== post.author?._id && (
								<>
									{
										isFollowing ? (
											<Button variant='ghost' className=" rounded-xl text-red-500 hover:text-red-500 font-bold w-fit my-2" onClick={followUnfollowHandler}>Unfollow </Button>
										) : (
											<Button variant='ghost' className=" rounded-xl text-[#3BADF8] hover:text-[#2a8aca] font-bold w-fit my-2" onClick={followUnfollowHandler}>Follow </Button>
										)
									}
									<hr className='w-full' />
								</>
							)
						}

						{
							user && user?._id === post.author?._id && (
								<>
									<Button variant='ghost' className="rounded-xl text-red-500 hover:text-red-500 font-bold w-fit mt-2 mb-0" onClick={deletePostHandler}>Delete </Button><hr className='w-full' />
								</>
							)
						}

						{
							isBookMarked ? (
								<Button variant='ghost' className=" rounded-xl font-bold w-fit my-2" onClick={bookmarkHandler} >Remove to favorites </Button>
							) : (
								<Button variant='ghost' className=" rounded-xl font-bold w-fit my-2" onClick={bookmarkHandler} >Add to favorites </Button>
							)
						}
						<hr className='w-full' />
						<Button variant='ghost' className=" rounded-xl font-bold w-fit my-2" onClick={() => {
							dispatch(setSelectedPost(post))
							setOpenCommentDialog(true)
						}}>Go to post</Button><hr className='w-full ' />
						<Button variant='ghost' className=" rounded-xl font-bold w-fit my-2"><Link to={`/profile/${post?.author._id}`}>About this account</Link></Button>
					</DialogContent>

				</Dialog>

			</div>

			<img
				className='rounded-lg my-2 w-full object-cover bg-top aspect-square'
				src={post.image}
				alt="post_img"
			/>

			<div className=" mx-[10px] 640px:mx-0">

				<div className="flex items-center justify-between my-2">
					<div className="flex gap-3">
						{
							liked ? <FaHeart onClick={likeDisLikHandler} className={`cursor-pointer text-red-600 size-5 md:size-6 ${isAnimating ? 'animate-heartBeat' : ''}`} /> : <FaRegHeart onClick={likeDisLikHandler} className='cursor-pointer hover:text-gray-600 size-5 md:size-6' />
						}

						<MessageCircle onClick={() => {
							dispatch(setSelectedPost(post))
							setOpenCommentDialog(true)
						}} className='cursor-pointer hover:text-gray-600 size-5 md:size-6' />
						<Send className='cursor-pointer hover:text-gray-600 size-5 md:size-6' />
					</div>
					<div className="">
						{
							isBookMarked ? <IoBookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600 size-5 md:size-6' /> : <IoBookmarkOutline onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600 size-5 md:size-6' />
						}
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
						setOpenCommentDialog(true)
					}} className='cursor-pointer text-sm text-gray-400'>view all {comment.length} comments</span>
				}

				<CommentDialog
					openCommentDialog={openCommentDialog}
					setOpenCommentDialog={setOpenCommentDialog}
					isFollowing={isFollowing}
					setIsFollowing={setIsFollowing}
					followUnfollowHandler={followUnfollowHandler}
					likeDisLikHandler={likeDisLikHandler}
					bookmarkHandler={bookmarkHandler}
					isAnimating={isAnimating}
					setIsAnimating={setIsAnimating}
					liked={liked}
					setLiked={setLiked}
					postLike={postLike}
				/>

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

				<hr className='w-full my-4 border-gray-300' />
		</div>

	)
}

export default Post
