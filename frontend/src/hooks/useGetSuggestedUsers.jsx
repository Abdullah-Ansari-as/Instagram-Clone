import { setSuggestedUsers } from "@/redux/authSlice"; 
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
	const dispatch = useDispatch()
	useEffect(() => {
		const getSuggestedUsers = async () => {
			try {
				const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/v1/users/suggested`, { withCredentials: true });
				// console.log(res)
				if (res.data.success) {
					dispatch(setSuggestedUsers(res.data.users))
				} 
			} catch (error) {
				console.log(error)
			}
		}
		getSuggestedUsers();
	}, [])
}
export default useGetSuggestedUsers;