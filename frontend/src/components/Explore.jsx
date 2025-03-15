import { Heart, MessageCircle, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CommentDialog from './CommentDialog'
import { setSelectedPost } from '@/redux/postSlice'
import axios from 'axios'
import { toast } from 'sonner'
import SearchOpen from './SearchOpen'

function Explore() {

	const { posts, selectedPost } = useSelector(store => store.post)
	const { user } = useSelector(store => store.auth)
	const [open, setOpen] = useState(false)
	const dispatch = useDispatch();

	const [searchOpen, setSearchOpen] = useState(false)

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
		<>
			<div className="sticky top-0 h-14 mx-auto flex items-center justify-center bg-white z-10 w-full sm:hidden max-w-md sm:mt-7">
				<Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
				<input
					className="bg-[#EFEFEF] w-[90vw] pl-7 pr-3 py-1 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
					placeholder="Search"
					onClick={() => setSearchOpen(true)}
				/>
			</div>
			<SearchOpen searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

			<div className='flex 1251px:w-[70rem] 1175px:w-[65rem] 1120px:w-[57rem] 1120px:mx-auto 1120px:pl-24 sm:p-0 mx-0 sm:mx-6'>
				<div className="flex flex-col gap-10 p-0 sm:pl-20 pb-12 sm:py-8">
					<div className='grid grid-cols-3 gap-[3px] sm:gap-2'>

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
											<div className="flex items-center text-center space-x-4 ">
												<div className="hidden sm:flex sm:gap-2">
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
									</div>
								)

							})
						}
						<CommentDialog
							open={open}
							setOpen={setOpen}
							isFollowing={isFollowing}
							followUnfollowHandler={followUnfollowHandler}
						/>
					</div>
				</div>
			</div>

		</>
	)
}

export default Explore
