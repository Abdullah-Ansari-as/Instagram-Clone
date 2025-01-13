import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

function CreatePost({ open, setOpen }) {

	const [file, setFile] = useState("");
	const [caption, setCaption] = useState("");
	const [imgPreview, setImgpreview] = useState("");
	const [loading, setLoading] = useState(false); 


	const imgRef = useRef();

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
				toast.success(res.data.message);
			}
		} catch (error) {
			toast.error(error.response.data.message)
		} finally {
			setLoading(false)
		}
	}

	const user = useSelector(state => state.auth)
	// console.log(user.user.profilePicture)

	return (
		<Dialog open={open} className=''>
			<DialogContent onInteractOutside={() => setOpen(false)} className='w-[18rem] md:w-[26rem] rounded-xl gap-0 bg-white pb-5 border-none sm:border-none '>
				<DialogHeader className='sm:text-center font-semibold text-lg py-3'>
					Create new Post
				</DialogHeader>
				<hr className='bg-slate-400' />

				<div className="mx-3">
					<div className='flex gap-3 items-center my-5'>
						<Avatar>
							<AvatarImage src={user?.user?.profilePicture} alt='img' />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<div>
							<h1 className='font-semibold text-xs'>username</h1>
							<span className='text-gray-600 text-xs'>Bio here...</span>
						</div>
					</div>

					<Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="focus-visible:ring-transparent border-none mb-3" placeholder="write a caption..." />
					{
						imgPreview && (
							<div className="w-full h-64 flex items-center justify-center">
								<img src={imgPreview} alt="image_preview" className='w-full h-full object-contain rounded-md' />
							</div>
						)
					}
					<input ref={imgRef} type='file' className='hidden' onChange={fileChangeHandler}></input>
					<Button onClick={() => imgRef.current.click()} className='flex w-fit mx-auto bg-[#0095f6] hover:bg-[#097fce] rounded'>Choose a file</Button>
					{
						imgPreview && (
							loading ? (
								<Button>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Please wait
								</Button>
							) : (
								<Button onClick={createPostHandler} type='submit' className='w-full mt-3'>Post</Button>
							)
						)
					}

				</div>

			</DialogContent>
		</Dialog>
	)
}

export default CreatePost
