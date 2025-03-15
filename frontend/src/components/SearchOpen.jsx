import React, { useEffect, useState } from 'react';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"
import { Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { RxCrossCircled } from "react-icons/rx";

function SearchOpen({ searchOpen, setSearchOpen }) {
	// console.log(searchOpen)
	const [searchInput, setSearchInput] = useState("")
	const suggestedUsers = useSelector(store => store.auth.suggestedUsers)
	// console.log(suggestedUsers)

	const searchedUser = suggestedUsers.filter((user) => {
		return user.username.toLowerCase().includes(searchInput.toLowerCase());
	})
	// console.log(searchedUser)

	const searchedUserclickHandler = () => {
		setSearchOpen(false)
		setSearchInput("")
	}

	return (

		<Sheet open={searchOpen}>
			<SheetContent onInteractOutside={() => {setSearchOpen(false), setSearchInput("")}} side={"left"} className="w-[290px] sm:w-[540px] bg-white rounded-r-2xl">
				<SheetHeader>
					<SheetTitle className='font-semibold text-2xl sm:mt-4 mt-0'>Search</SheetTitle>
					<SheetDescription>
						<div className="relative w-full max-w-md sm:mt-7 mt-2">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
							<input
								className="w-full bg-[#EFEFEF] pl-10 pr-3 py-2 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
								placeholder="Search"
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
							/>
							<button onClick={() => setSearchInput("")}><RxCrossCircled className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" /></button>
						</div>
						<hr className='w-full mt-4' />
					</SheetDescription>
				</SheetHeader>
				<div className='mt-3'>
					<span className='font-semibold '>Recent</span>
				</div>

				{
					searchInput === "" && <div className="flex items-center justify-center h-[65%]">
						<p className='text-gray-500 text-sm'>No recent searches.</p>
					</div>
				} 

				<div className="h-[63vh] overflow-y-auto w-full ">
					{
						searchInput && searchedUser.map((user) => {
							return (

								<Link to={`/profile/${user._id}`} onClick={searchedUserclickHandler}>
									<div className="flex items-center gap-2 my-3 hover:bg-gray-100 p-1">
										{/* <Link to={`/profile/${user._id}`} onClick={searchedUserclickHandler}> */}
										<Avatar>
											<AvatarImage src={user?.profilePicture} alt='Post_image' className='object-cover'/>
											<AvatarFallback>CN</AvatarFallback>
										</Avatar>
										{/* </Link> */}
										<div className=''>
											<h1 className='font-semibold text-sm'>{user?.username}</h1>
											<span className='text-gray-600 text-sm'>{user?.bio.length > 30 ? user?.bio.slice(0, 30) + '...' : user?.bio || "Bio here"}</span>
										</div>
									</div>
								</Link>

							)
						})
					}
				</div>
				
			</SheetContent>
		</Sheet>

	)
}

export default SearchOpen
