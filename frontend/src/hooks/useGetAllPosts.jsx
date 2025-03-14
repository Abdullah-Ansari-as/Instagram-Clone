import { setPosts } from "@/redux/postSlice";
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux";


const useGetAllPosts = () => {
	const dispatch = useDispatch() 
	useEffect(() => {
		const fetchAllPosts = async () => {
			try {
				// console.log("before")
				const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/v1/posts/all`, { withCredentials: true });
				// console.log(res)
				if (res.data.success) {
					dispatch(setPosts(res.data.posts))
				}
			} catch (error) {
				console.log(error)
			}
		}
		fetchAllPosts();
	}, [])
};

export default useGetAllPosts;