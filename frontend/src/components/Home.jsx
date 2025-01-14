import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPosts from '@/hooks/useGetAllPosts'

function Home() {
	useGetAllPosts()
	return (
		
		<div className='flex'>
			<div className="flex-grow">
				  <Feed />
				  <Outlet />
			</div> 
			<RightSidebar />
		</div>
	)
}



export default Home
