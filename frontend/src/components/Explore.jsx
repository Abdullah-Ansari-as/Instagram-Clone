import { Heart, MessageCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CommentDialog from './CommentDialog'
import { setSelectedPost } from '@/redux/postSlice'

function Explore() {

	const { posts } = useSelector(store => store.post)
	const [open, setOpen] = useState(false) 
	const dispatch = useDispatch();

	// if (loading) {
	// 	return (
	// 		<div className="flex h-screen items-center justify-center">
	// 			<div aria-label="Loading..." role="status"><svg class="h-12 w-12 animate-spin stroke-gray-500" viewBox="0 0 256 256">
	// 			<line x1="128" y1="32" x2="128" y2="64" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
	// 			<line x1="195.9" y1="60.1" x2="173.3" y2="82.7" stroke-linecap="round" stroke-linejoin="round"
	// 				stroke-width="24"></line>
	// 			<line x1="224" y1="128" x2="192" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24">
	// 			</line>
	// 			<line x1="195.9" y1="195.9" x2="173.3" y2="173.3" stroke-linecap="round" stroke-linejoin="round"
	// 				stroke-width="24"></line>
	// 			<line x1="128" y1="224" x2="128" y2="192" stroke-linecap="round" stroke-linejoin="round" stroke-width="24">
	// 			</line>
	// 			<line x1="60.1" y1="195.9" x2="82.7" y2="173.3" stroke-linecap="round" stroke-linejoin="round"
	// 				stroke-width="24"></line>
	// 			<line x1="32" y1="128" x2="64" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
	// 			<line x1="60.1" y1="60.1" x2="82.7" y2="82.7" stroke-linecap="round" stroke-linejoin="round" stroke-width="24">
	// 			</line>
	// 		</svg>
	// 		</div>
	// 		</div>
	// 	)
	// }

	useEffect(() => {
		
	}, [])

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
					<CommentDialog open={open} setOpen={setOpen} />
				</div>
			</div>
		</div>

	)
}

export default Explore
 