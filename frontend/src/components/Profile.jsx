import useGetUserProfile from '@/hooks/useGetUserProfile'
import React from 'react'
import { useParams } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';

function Profile() {
	const params = useParams();
	const userId = params.id;
	useGetUserProfile(userId)

	const { userProfile } = useSelector(store => store.auth);
	// console.log(userProfile);

	const isLoggedInUserProfile = false
	const isFollowing = false


	return (
		<div className='flex max-w-4xl justify-center mx-auto pl-10'>
			<div className="flex flex-col gap-20 p-8">

				<div className='grid grid-cols-2'>

					<section className='flex items-center justify-center'>
						<Avatar className='h-32 w-32'>
							<AvatarImage src={userProfile?.profilePicture} alt="profile_Photo" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
					</section>

					<section>
						<div className="flex flex-col gap-3">
							<div className='flex items-center gap-2'>
								<span>{userProfile?.username}</span>
								{
									isLoggedInUserProfile ? (
										<>
											<Button variant='secondary' className='bg-[#eeeded] hover:bg-[#dbdbdb] h-8 rounded-xl'>Edit profile</Button>
											<Button variant='secondary' className='bg-[#eeeded] hover:bg-[#dbdbdb] h-8 rounded-xl'>View archive</Button>
											<Button variant='secondary' className='bg-[#eeeded] hover:bg-[#dbdbdb] h-8 rounded-xl'>Ad tools</Button>
										</>
									) : (
										isFollowing ? (
											<>
												<Button variant='secondary' className='bg-[#eeeded] hover:bg-[#dbdbdb] h-8 rounded'>Unfollow</Button>
												<Button variant='secondary' className='bg-[#eeeded] hover:bg-[#dbdbdb] h-8 rounded'>Message</Button>
											</>
										) : (
											<Button className='bg-[#0095F6] hover:bg-[#3192d2] h-8 rounded'>Follow</Button>
										)

									)
								}
							</div>

							<div className='flex items-center gap-4'>
								<p> <span className='font-semibold'>{userProfile?.posts.length}</span> posts</p>
								<p> <span className='font-semibold'>{userProfile?.followers.length}</span> followers</p>
								<p> <span className='font-semibold'>{userProfile?.following.length}</span> following</p>
							</div>
						</div>
					</section>

				</div>

			</div>
		</div>
	)
}

export default Profile
