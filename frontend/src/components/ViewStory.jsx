import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'; 
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from './ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Loader2 } from 'lucide-react';

function ViewStory({ openStatus, setOpenStatus, selectedUserStory, duration = 6000 }) {
	// console.log(selectedUserStory)

	const [statusLoader, setStatusLoader] = useState(true);

	useEffect(() => {
		if(selectedUserStory) {
			setStatusLoader(false)
		}
	}, [selectedUserStory])

	const [progress, setProgress] = useState(0);

	useEffect(() => {

		if (!openStatus) return; // Prevent running if modal is closed

		setProgress(0); // Reset progress when the modal opens

		const interval = setInterval(() => {
			setProgress((oldProgress) => {
				if (oldProgress >= 100) {
					clearInterval(interval);
					setOpenStatus(false); // Close story when completed
					setProgress(0)
					return 0;
				}
				return oldProgress + 1;
			});
		}, duration / 100);

		return () => clearInterval(interval);
	}, [duration, openStatus]);


	return (

		selectedUserStory && (

			<Dialog open={openStatus} onOpenChange={setOpenStatus}>
				{
					openStatus && <div className="fixed inset-0 bg-[#5e5d5d] z-50" onClick={() => setOpenStatus(false)} />
				}
				<DialogContent onInteractOutside={() => setOpenStatus(false)} className='w-[255px] sm:w-[18rem] h-[76vh] sm:h-[96vh] lg:border-none md:w-[26rem] rounded-xl gap-0 bg-black pb-5 sm:border-none' >
					<DialogHeader>
						<div className="w-full h-[94px] bg-black rounded-xl flex flex-col relative overflow-hidden">
							{/* Loader Bar */}
							<div className="absolute top-2 left-4 right-4 h-1 bg-gray-500/50 rounded-full overflow-hidden">
								<div
									className="h-full bg-white transition-all"
									style={{ width: `${progress}%` }}
								></div>
							</div>
							<div className='mx-4 relative top-7'>
								<div className="flex items-center gap-2">
									<Link to={`/profile/${selectedUserStory?.author._id}`}>
										<Avatar>
											<AvatarImage className='object-cover' src={selectedUserStory.author.profilePicture} alt='Post_image' />
											<AvatarFallback>CN</AvatarFallback>
										</Avatar>
									</Link>
									<div className=''>
										<div className="flex gap-2 items-center">
											<h1 className='font-semibold text-sm text-gray-50'><Link to={`/profile/${selectedUserStory?.author?._id}`}>{selectedUserStory.author?.username}</Link></h1>
											<span className='text-xs text-gray-300'>{new Date(selectedUserStory.createdAt).toLocaleTimeString()}</span>
										</div>
										<span className='text-gray-50 text-sm'>{selectedUserStory?.author?.bio?.length > 45 ? selectedUserStory?.author.bio?.slice(0, 45) + '...' : selectedUserStory?.author?.bio || "Bio here"}</span>
									</div>
								</div>
							</div>
						</div>
					</DialogHeader>

					{
						statusLoader ? (
							<div className='flex h-screen justify-center items-center'><Loader2 className='text-slate-400 h-12 w-12 animate-spin' /></div>					
						) : (
							<div className="flex items-center justify-center h-72">

						<div className="w-full h-96 overflow-hidden flex justify-center items-center">

							<img
								src={selectedUserStory?.imageUrl}
								alt="story-image"
								className="h-full w-auto object-contain"
							/>

						</div>

					</div>
						)
					}


				</DialogContent>
			</Dialog>
		)

	)
}

export default ViewStory
