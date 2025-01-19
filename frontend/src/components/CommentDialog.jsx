import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts } from '@/redux/postSlice'

function CommentDialog({ open, setOpen }) {

  const { selectedPost, posts } = useSelector(store => store.post)
  // console.log(selectedPost)

  const [text, setText] = useState("");
  const [comment, setComment] = useState([]);
  // console.log(comment)

  useEffect(() => {
    if(selectedPost) {
      setComment(selectedPost?.comments)
    }
  }, [selectedPost])

  const dispatch = useDispatch()

  const onChangeHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  }
 

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    try { 
      // console.log(selectedPost._id)
      const res = await axios.post(`http://localhost:3000/api/v1/posts/${selectedPost._id}/comment`, { text }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log(res.data);
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        // update my redux state
        const updatedPostData = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));

        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      if (error.response) {
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
      } else if (error.request) {
        console.log('Request made but no response:', error.request);
      } else {
        console.log('Error:', error.message);
      }
    }
  }

  return (
    <Dialog open={open} className=''>
      <DialogContent
        className='max-w-2xl p-0 flex flex-col  w-[70vw] md:w-[80vw] h-[80vh] '
        onInteractOutside={() => setOpen(false)}
      >
        <div className="flex flex-col md:flex-row flex-1 h-[32rem]">
          <div className='w-full md:w-1/2'>
            <img
              className='w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none'
              src={selectedPost?.image}
              alt="post_img"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col bg-white rounded-r-[9px]">
            <div className="flex items-center justify-between p-2 border-b">
              <div className='flex items-center gap-3'>
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className='font-semibold text-sm mr-2'>{selectedPost?.author?.username}</Link>
                  {/* <span className='text-xs text-gray-500'>Bio here</span> */}
                </div>
              </div>
              <Dialog>

                <DialogTrigger asChild>
                  <button className='p-2'>
                    <MoreHorizontal className='w-5 h-5 text-gray-600' />
                  </button>
                </DialogTrigger>

                <DialogContent className='flex flex-col items-center text-center text-sm lg:w-[28rem] w-72 bg-white border rounded-[20px] gap-0 px-0' >
                  <Button variant='ghost' className=" rounded-xl text-red-500 hover:text-red-500 font-bold w-fit my-2">Unfollow </Button><hr className='w-full color' />
                  <Button variant='ghost' className=" rounded-xl font-bold w-fit my-2">Not interested </Button><hr className='w-full color' />
                  <Button variant='ghost' className=" rounded-xl font-bold w-fit my-2">Add to favorites </Button><hr className='w-full color' />
                  <Button variant='ghost' className=" rounded-xl font-bold w-fit my-2">go to profile</Button><hr className='w-full color' />
                  <Button variant='ghost' className=" rounded-xl font-bold w-fit my-2">Share to... </Button><hr className='w-full color' />
                  <Button variant='ghost' className=" rounded-xl font-bold w-fit my-2">Copy </Button><hr className='w-full color' />
                  <Button variant='ghost' className=" rounded-xl font-bold w-fit mt-2 mb-0">cancel </Button>
                </DialogContent>

              </Dialog>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {/* Comments and content go here */}
              <p className='text-sm text-gray-600'>
                {
                  comment && comment.slice().reverse().map((comment) => {
                    // console.log(comment);
                    return <Comment key={comment._id} comment={comment} />
                  })
                }
              </p>
            </div>
            <div className="border-t p-4">
              <form onSubmit={handleSubmitComment} className='flex items-center'>
                <input
                  type="text"
                  value={text}
                  onChange={onChangeHandler}
                  placeholder="Add a comment..."
                  className="flex-1 p-2 border rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button type="submit" disabled={!text.trim()} className='ml-3 text-blue-500 font-semibold text-sm'>Post</Button>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

  )
}

export default CommentDialog
