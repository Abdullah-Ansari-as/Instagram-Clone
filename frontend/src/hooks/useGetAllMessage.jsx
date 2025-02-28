import { setMessages } from "@/redux/chatSlice"; 
import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";


const useGetAllMessage = () => {
	const dispatch = useDispatch();
	const {selectedUser} = useSelector(store => store.auth); 
	// console.log(selectedUser._id)
	useEffect(() => {
		const fetchAllMessage = async () => {
			try {
				// console.log("before")
				const res = await axios.get(`http://localhost:3000/api/v1/messages/all/${selectedUser?._id}`, { withCredentials: true });
				// console.log(res)
				if (res.data.success) {
					dispatch(setMessages(res.data.messages))
				}
			} catch (error) {
				console.log(error)
			}
		}
		fetchAllMessage();
	}, [selectedUser])
};

export default useGetAllMessage;