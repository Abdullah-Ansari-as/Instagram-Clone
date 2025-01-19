import { setUserProfile } from "@/redux/authSlice"; 
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => { 
	const dispatch = useDispatch()
	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const res = await axios.get(`http://localhost:3000/api/v1/users/${userId}/profile`, { withCredentials: true });
				// console.log(res)
				if (res.data.success) {
					dispatch(setUserProfile(res.data.data))
				} 
			} catch (error) {
				console.log(error)
			}
		}
		fetchUserProfile();
	}, [userId])
}
export default useGetUserProfile;