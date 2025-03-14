import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

function EditProfile() {

	const { user } = useSelector(store => store.auth);
	// console.log(user)
	const imgRef = useRef();

	const [loading, setLoading] = useState(false);
	const  [input, setInput] = useState({
		profilePhoto: user?.profilePicture,
		bio: user?.bio,
		gender: user?.gender	
	})

	console.log(input)

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const fileChangeHandler = (e) => {
		const file = e.target.files?.[0];
		// console.log(file)
		if(file) setInput({ ...input, profilePhoto: file });
	}

	const selectChangeHandler = (value) => {
		setInput({ ...input, gender: value})
	}

	const editProfileHandler = async () => {
		// console.log(input)
		const formData = new FormData();
		formData.append("bio", input.bio);
		formData.append("gender", input.gender); 
		if(input.profilePhoto) {
			formData.append("profilePhoto", input.profilePhoto)
		}

		try {
			setLoading(true) 
			const res = await axios.post('http://localhost:3000/api/v1/users/profile/edit', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				withCredentials: true
			});
			// console.log(res)
			if(res.data.success) {
				const updatedUserData = {
					...user,
					bio: res.data.data?.bio,
					profilePicture: res.data.data?.profilePicture,
					gender: res.data.data?.gender
				}
				// console.log(updatedUserData)
				dispatch(setAuthUser(updatedUserData));
				navigate(`/profile/${user?._id}`)
				toast.success(res.data.message)
			}
		} catch (error) {
			console.log(error)
			toast.error(error.response.data.message)
		} finally {
			setLoading(false)
		}
	}


	return (
		<div className='flex sm:max-w-[45rem] w-[80vw] mx-auto pl-0 sm:pl-10 '>
			<section className='flex flex-col gap-6 w-full mt-3 sm:mt-8'>
				<h1 className='font-bold text-xl'>Edit profile</h1>

				<div className="flex items-center justify-between bg-[#EFEFEF] rounded-xl p-4">
					<div className="flex items-center gap-3">
						<Avatar>
							<AvatarImage src={user?.profilePicture} alt='Post_image' className='object-cover'/>
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<div className=''>
							<h1 className='font-bold text-sm'>{user?.username}</h1>
							<span className='text-gray-600'>{user?.bio}</span>
						</div>
					</div>

					<input ref={imgRef} onChange={fileChangeHandler} type='file' className='hidden' />
					<Button onClick={() => imgRef.current.click()} className='bg-[#0095f6] rounded-xl hover:bg-[#028ae4] text-xs sm:text-base p-2 sm:p-4 '>Change photo</Button>

				</div>

				<div>
					<h1 className='font-bold text-xl mb-2'>Bio</h1>
					<Textarea maxLength="100" name="bio" value={input.bio} onChange={(e) => setInput({...input, bio: e.target.value})} id="" className='rounded border-gray-300 focus-visible:ring-transparent' />
				</div>
				<div>
					<h1 className='font-bold mb-2'>Gender</h1>
					<Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
						<SelectTrigger className="w-full rounded">
							<SelectValue/>
						</SelectTrigger>
						<SelectContent>
							<SelectGroup> 
								<SelectItem value="male">Male</SelectItem>
								<SelectItem value="female">Female</SelectItem> 
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div className='flex justify-end'> 
					{
						loading ? (
							<Button className='w-fit bg-[#0095f6] hover:bg-[#028ae4] rounded'>
								<Loader2 className='mr-2 h-4 w-4 animate-spin'/>
								Please wait
							</Button>
						) : (
							<Button onClick={editProfileHandler} className="w-fit bg-[#0095f6] hover:bg-[#028ae4] rounded">Submit</Button>
						)
					}
				</div>

			</section>
		</div>
	)
}

export default EditProfile
