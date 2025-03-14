import React, { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux';
import { FiPlusCircle } from "react-icons/fi";
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { toast } from 'sonner';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import useGetStories from '@/hooks/useGetStories';
import { setLoggedInUserStory, setStories } from '@/redux/storySlice';
import ViewStory from './ViewStory';

function AddStory() {
	useEffect(() => {
		const fetchStories = async () => {
			await useGetStories(); // Call the function properly
		};

		fetchStories();
	}, []);

	const { user } = useSelector(store => store.auth);
	// console.log(user)
	const { stories } = useSelector(store => store.story);
	// console.log(stories)


	const [openStatus, setOpenStatus] = useState(false);
	const [selectedUserStory, setSelectedUserStory] = useState(null);

	const storyRef = useRef();
	const dispatch = useDispatch();

	const [open, setOpen] = useState(false)
	const [file, setFile] = useState("");
	const [imgPreview, setImgpreview] = useState("");
	const [loading, setLoading] = useState(false);
	// console.log(openStatus)


	// const [storyId, setStoryId] = useState("");
	// const [loggedInUserId, setLoggedInUserId] = useState("")
	// console.log(storyId)

	useEffect(() => {
		setOpenStatus(false)
	}, [user?._id])

	const fileChangeHandler = async (e) => {
		const file = e.target.files?.[0];
		if (file) {
			setFile(file);
			const dataUrl = await readFileAsDataURL(file);
			// console.log(dataUrl)
			setImgpreview(dataUrl);
		}
	}

	const uploadStoryHandler = async (e) => {
		const formData = new FormData();
		if (imgPreview) formData.append('storyImage', file);

		try {
			// check if already upload a story.
			const isUploadedStory = stories?.some(story => story.author._id === user?._id);

			if (isUploadedStory) {
				toast.message('To share your new story, we’ll first remove the previous one')
				setOpen(false)
				setImgpreview("")

			} else {

				setLoading(true)
				const res = await axios.post('http://localhost:3000/api/v1/story/upload/story', formData, {
					headers: {
						'Content-Type': 'multipart/form-data'
					},
					withCredentials: true
				});
				console.log(res)
				if (res.data.success) {
					// real time update when new story is uploaded
					dispatch(setStories([...stories, res.data.newStory]))
					toast.success(res.data.message);
					setOpen(false)
					setImgpreview("")
				}
			}

		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false)
		}
	}


	// true if loggedin user uploaded story. otherwise fasle.
	const isUploadedStory = stories?.some(story => story.author._id === user?._id);
	if (isUploadedStory) {
		dispatch(setLoggedInUserStory(true))
	} else {
		dispatch(setLoggedInUserStory(false))
	}
	// console.log(isUploadedStory)


	// Find logged-in user's story
	const loggedInUserStory = stories.find(story => story.author._id === user?._id);

	// Find other users' stories
	const otherUsersStories = stories.filter(story => story.author._id !== user?._id);

	// Combine: Logged-in user first, then others
	const sortedStories = loggedInUserStory ? [loggedInUserStory, ...otherUsersStories] : otherUsersStories;

	// console.log(selectedUserStory)
	return (
		<>

			<div className="w-[20rem] lg:w-[26rem] 1251px:w-[37rem] 1175px:w-[31rem] flex items-center sm:mt-5">

				{
					!isUploadedStory && <div
						onClick={!isUploadedStory ? () => { setOpen(true); setImgpreview("") } : () => { setOpenStatus(true) }}
						className={`flex items-end cursor-pointer relative bottom-[11px]`}
						title='Upload your story'
					>
						<div className={`${isUploadedStory && 'p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 rounded-full'}`}>
							<Avatar className="w-[66px] h-[66px] group-hover:scale-95 border-2 transition-transform border-white rounded-full">
								<AvatarImage
									className="bg-gray-200 grayscale-[10%] hover:grayscale-[40%] object-cover"
									src={user?.profilePicture}
								/>
								<AvatarFallback className="bg-gray-200 text-white">CN</AvatarFallback>
							</Avatar>
						</div>
						{
							isUploadedStory || <FiPlusCircle className='bg-white rounded-full relative right-5 h-4 w-4' />
						}
					</div>
				}

				<div className={`gap-3 h-[100px] flex overflow-x-auto
									[&::-webkit-scrollbar]:h-1
									[&::-webkit-scrollbar-track]:rounded-full
									[&::-webkit-scrollbar-track]:bg-gray-100
									[&::-webkit-scrollbar-thumb]:rounded-full
									[&::-webkit-scrollbar-thumb]:bg-gray-300
									dark:[&::-webkit-scrollbar-track]:bg-neutral-700
									dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 ${isUploadedStory ? "ml-4" : ""}`}>
					{sortedStories && sortedStories.map((story) => (
						<div
							key={story.author._id}
							className={`flex items-end cursor-pointer relative bottom-[6px]`}
							onClick={() => {
								setSelectedUserStory(story); // Set selected story
								setOpenStatus(true); // Open dialog
							}}
							title='Upload your story'
						>
							<div className="flex flex-col items-center">
								<div className={`${stories && 'p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 rounded-full'}`}>
									<Avatar className="w-[66px] h-[66px] group-hover:scale-95 border-2 transition-transform border-white rounded-full">
										<AvatarImage
											className="bg-gray-200 object-cover grayscale-[10%] hover:grayscale-[40%]"
											src={story?.author?.profilePicture}
											alt={story.author.username}
										/>
										<AvatarFallback className="bg-gray-200 text-white">CN</AvatarFallback>
									</Avatar>
								</div>
								<span className='text-xs mt-1 font-normal'>
									{story?.author.username}
								</span>
							</div>
						</div>
					))}
				</div>

			</div>


			<Dialog open={open} className=''>
				<DialogContent onInteractOutside={() => setOpen(false)} className='w-[18rem] md:w-[26rem] rounded-xl gap-0 bg-white pb-5 border-none sm:border-none '>
					<DialogHeader className='sm:text-center font-semibold text-lg py-3'>
						Upload your story
					</DialogHeader>
					<hr className='bg-slate-400' />

					<div className="mx-3">
						<div className='flex gap-3 items-center my-5'>
							<Avatar>
								<AvatarImage src={user?.profilePicture} alt='img' />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
							<div>
								<h1 className='font-semibold text-xs'>{user?.username}</h1>
								<span className='text-gray-600 text-xs'>{user?.bio}</span>
							</div>
						</div>

						{
							imgPreview && (
								<div className="w-full h-64 flex items-center justify-center">
									<img src={imgPreview} alt="image_preview" className='w-full h-full object-contain rounded-md' />
								</div>
							)
						}
						<input ref={storyRef} type='file' className='hidden' onChange={fileChangeHandler}></input>
						<Button onClick={() => storyRef.current.click()} className='flex w-fit mx-auto mt-2 bg-[#0095f6] hover:bg-[#097fce] rounded'>Choose a file</Button>
						{
							imgPreview && (
								loading ? (
									<Button className='w-full mt-3 flex justify-center text-white bg-slate-800 rounded hover:bg-slate-800'>
										<Loader2 className='mr-1 h-4 w-4 animate-spin ' />
										Please wait
									</Button>
								) : (
									<Button onClick={uploadStoryHandler} type='submit' className='w-full mt-3 bg-slate-800 hover:bg-slate-900 rounded text-white'>Upload</Button>
								)
							)
						}

					</div>

				</DialogContent>
			</Dialog>

			<ViewStory openStatus={openStatus} setOpenStatus={setOpenStatus} selectedUserStory={selectedUserStory} setSelectedUserStory={setSelectedUserStory} />

		</>

	)
}

export default AddStory
