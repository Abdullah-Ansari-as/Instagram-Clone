import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'

function Login() {

	const { user } = useSelector(store => store.auth);

	const [input, setInput] = useState({
		email: "",
		password: "",
	})
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate()
	const dispatch = useDispatch();

	const chagneEventHandler = (e) => {
		setInput({ ...input, [e.target.name]: e.target.value })
	}


	const signupHandler = async (e) => {
		e.preventDefault();
		try {
			setLoading(true)
			const res = await axios.post('http://localhost:3000/api/v1/users/login', input, {
				headers: {
					'Content-Type': 'application/json'
				},
				withCredentials: true
			});
			console.log(res)
			if (res.data.success) {
				dispatch(setAuthUser(res.data.user))
				navigate('/')
				toast.success(res.data.message);
				setInput({
					email: "",
					password: "",
				})
			}
			// console.log(res)
		} catch (error) {
			console.log("Login handler error" + error)
			toast.error(error.response.data.message);
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (user) {
			navigate("/")
		}
	}, []);

	return (
		<div className='flex justify-center items-center w-screen h-screen'>
			<form onSubmit={signupHandler} className="shadow-xl p-8 flex flex-col gap-5 mx-3">
				<div className="my-4">
					<img
						className='lg:block pl-4 w-44 flex justify-center m-auto'
						src="/instaLogo.png"
						alt="Logo" />
					<p className='text-sm text-center'>Login to see photos and videos for your friends</p>
				</div>
				<div className="">
					<span className="font-medium">Email</span>
					<Input
						type="email"
						name="email"
						value={input.email}
						onChange={chagneEventHandler}
						className="rounded my-1 border border-gray-500"
					/>
				</div>
				<div className="">
					<span className="font-medium">Password</span>
					<Input
						type="password"
						name="password"
						value={input.password}
						onChange={chagneEventHandler}
						className="rounded my-1 border border-gray-500"
					/>
				</div>
				{
					loading ? (
						<Button>
							<Loader2 className='h-4 w-4 animate-spin' />
							Please wait
						</Button>
					) : (
						<Button type="submit" className="bg-slate-800 hover:bg-slate-900 rounded text-white text-md">Login</Button>
					)
				}
				<span className='text-center'>if not have an account? Please <Link to='/signup' className='text-blue-600'>Signup</Link></span>
			</form>
		</div>
	)
}

export default Login
