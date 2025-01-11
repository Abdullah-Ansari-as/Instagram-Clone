import React from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'

function CommentDialog({ open, setOpen }) {
	return (
		<Dialog open={open} className=''>
			<DialogContent
				className='max-w-2xl p-0 flex flex-col  w-[70vw] md:w-[80vw] h-[80vh]'
				onInteractOutside={() => setOpen(false)}
			>
				<div className="flex flex-col md:flex-row flex-1 ">
					<div className='w-full md:w-1/2'>
						<img
							className='w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none'
							src="https://images.pexels.com/photos/28406651/pexels-photo-28406651/free-photo-of-historic-armenian-church-on-akdamar-island-van.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
							alt="post_img"
						/>
					</div>
					<div className="w-full md:w-1/2 flex flex-col bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <div className='flex items-center gap-3'>
            <Link>
              <Avatar>
                <AvatarImage src='' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link className='font-semibold text-sm mr-2'>username</Link>
              {/* <span className='text-xs text-gray-500'>Bio here</span> */}
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <button className='p-2'>
                <MoreHorizontal className='w-5 h-5 text-gray-600' />
              </button>
            </DialogTrigger>
          </Dialog>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {/* Comments and content go here */}
          <p className='text-sm text-gray-600'>This is where the comments would appear...</p>
        </div>
        <div className="border-t p-4">
          <form className='flex items-center'>
            <input 
              type="text" 
              placeholder="Add a comment..." 
              className="flex-1 p-2 border rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className='ml-3 text-blue-500 font-semibold text-sm'>Post</button>
          </form>
        </div>
      </div>
				</div>
			</DialogContent>
		</Dialog>


	)
}

export default CommentDialog
