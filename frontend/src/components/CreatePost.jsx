import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useDispatch, useSelector } from 'react-redux';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios'; 
import { setPosts } from '@/redux/postSlice';
import { setUserProfile } from '@/redux/authSlice';

function CreatePost({ open, setOpen }) { 

	const [file, setFile] = useState("");
	const [caption, setCaption] = useState("");
	const [imgPreview, setImgpreview] = useState("");
	const [loading, setLoading] = useState(false); 

	const {user, userProfile} = useSelector(store => store.auth);
	// console.log(user)
	// console.log(userProfile.posts)
	const {posts} = useSelector(store => store.post);
	// console.log(posts)' 

	const imgRef = useRef();
	const dispatch = useDispatch();

	const fileChangeHandler = async (e) => {
		const file = e.target.files?.[0];
		// console.log(file)
		if (file) {
			setFile(file);
			const dataUrl = await readFileAsDataURL(file);
			// console.log(dataUrl)
			setImgpreview(dataUrl);
		}
	}

	const createPostHandler = async (e) => {
		const formData = new FormData();
		formData.append('caption', caption)
		if(imgPreview) formData.append("image", file)

		try {
			// console.log(file, caption)
			setLoading(true)
			const res = await axios.post('http://localhost:3000/api/v1/posts/addpost', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				withCredentials: true
			});
			if(res.data.success) {
				// console.log(res.data.post)
				// real time update posts array in "userProfile" => a redux state variable
				if(user._id === res.data.post.author._id) {
					const currentPosts = userProfile.posts;
					const updatedPostsArray = [...currentPosts, res.data.post]
					dispatch(setUserProfile({...userProfile, posts: updatedPostsArray }))
				}
				dispatch(setPosts([...posts, res.data.post]))
				toast.success(res.data.message);
				setOpen(false)
				setCaption("")
				setImgpreview("")
			}
		} catch (error) {
			toast.error(error.response.data.message)
		} finally {
			setLoading(false)
		}
	}

	

	return (
		<Dialog open={open} className=''>
			<DialogContent onInteractOutside={() => {setOpen(false), setImgpreview(""), setCaption("")}} className='w-[248px] sm:w-[26rem] rounded-xl gap-0 bg-white pb-2 sm:pb-5 border-none sm:border-none '>
				<DialogHeader className='sm:text-center font-semibold text-lg py-3'>
					Create new Post
				</DialogHeader>
				<hr className='bg-slate-400' />

				<div className="mx-3">
					<div className='flex gap-3 items-center my-5'>
						<Avatar>
							<AvatarImage src={user?.profilePicture} alt='img' className='object-cover'/>
							<AvatarFallback className='bg-gray-200'>CN</AvatarFallback>
						</Avatar>
						<div>
							<h1 className='font-semibold text-xs'>{user?.username}</h1>
							<span className='text-gray-600 text-xs'>{user?.bio}</span>
						</div>
					</div>

					<Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="focus-visible:ring-transparent border-none mb-3" placeholder="write a caption..." />
					{
						imgPreview && (
							<div className="w-full h-64 flex items-center justify-center">
								<img src={imgPreview} alt="only picture can upload" className='w-full h-full object-contain rounded-md' />
							</div>
						)
					}
					<input ref={imgRef} type='file' className='hidden' onChange={fileChangeHandler}></input>
					<Button onClick={() => imgRef.current.click()} className='flex w-fit mx-auto mt-2 bg-[#0095f6] hover:bg-[#097fce] rounded'>Choose a file</Button>
					{
						imgPreview && (
							loading ? (
								<Button className='w-full mt-3 flex justify-center text-white bg-slate-800 rounded hover:bg-slate-800'>
									<Loader2 className='mr-1 h-4 w-4 animate-spin ' />
									Please wait
								</Button>
							) : (
								<Button onClick={createPostHandler} type='submit' className='w-full mt-3 bg-slate-800 hover:bg-slate-900 rounded text-white'>Post</Button>
							)
						)
					}

				</div>

			</DialogContent>
		</Dialog>
	)
}

export default CreatePost