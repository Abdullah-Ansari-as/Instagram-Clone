import { Heart, MessageCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CommentDialog from './CommentDialog'
import { setSelectedPost } from '@/redux/postSlice'
import axios from 'axios'
import { toast } from 'sonner'

function Explore() {

	const { posts, selectedPost } = useSelector(store => store.post)
	const { userProfile, user } = useSelector(store => store.auth)
	const [open, setOpen] = useState(false) 
	const dispatch = useDispatch();

	// console.log(user)

	const [isFollowing, setIsFollowing] = useState(false)
	useEffect(() => {
		setIsFollowing(user.following.includes(selectedPost?.author._id))
	}, [selectedPost?._id, user])

	const followUnfollowHandler = async () => {
		setIsFollowing((prev) => !prev)
		try {
			const res = await axios.post(`http://localhost:3000/api/v1/users/followorUnfollow/${selectedPost?.author._id}`, {}, { withCredentials: true });
			// console.log(res) 
			if (res.data.success) {
				toast.success(res.data.message);
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (

		<div className='flex w-[70rem] mx-auto pl-24'>
			<div className="flex w-[67rem] flex-col gap-10 pl-20 py-8 ">
				<div className='grid grid-cols-3 gap-2'>

					{
						posts.map((post) => {
							// console.log(post)
							return (
								<div onClick={() => {
									dispatch(setSelectedPost(post))
									setOpen(true)
								}} key={post._id} className='relative group cursor-pointer'>
									<img src={post.image} alt="postImage" className='rounded-sm w-full aspect-square object-cover bg-top' />
									<div className='absolute rounded inset-0 flex items-center justify-center bg-slate-800 opacity-0 bg-opacity-50 group-hover:opacity-100 transition-opacity duration-300'>
										<div className="flex items-center text-center space-x-4">
											<button className='flex items-center gap-2 text-white'>
												<Heart />
												<span className='text-lg font-bold'>{post?.likes.length}</span>
											</button>
											<button className='flex items-center gap-2 text-white'>
												<MessageCircle />
												<span className='text-lg font-bold'>{post?.comments.length}</span>
											</button>
										</div>
									</div>
								</div>
							)

						})
					}
					<CommentDialog open={open} setOpen={setOpen} isFollowing={isFollowing} followUnfollowHandler={followUnfollowHandler} />
				</div>
			</div>
		</div>

	)
}

export default Explore
 