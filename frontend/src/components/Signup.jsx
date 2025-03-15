import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'

function Signup() {

	const { user } = useSelector(store => store.auth);

	const [input, setInput] = useState({
		username: "",
		email: "",
		password: "",
	})
	const [loading, setLoading] = useState(false);


	const chagneEventHandler = (e) => {
		setInput({ ...input, [e.target.name]: e.target.value })
	}

	const navigate = useNavigate()

	const signupHandler = async (e) => {
		e.preventDefault();
		try {
			setLoading(true)
			const res = await axios.post('http://localhost:3000/api/v1/users/register', input, {
				headers: {
					'Content-Type': 'application/json'
				},
				withCredentials: true
			});
			if (res.data.success) {
				navigate('/login')
				toast.success(res.data.message);
				setInput({
					username: "",
					email: "",
					password: "",
				})
			}
			console.log(res)
		} catch (error) {
			console.log("Signup handler error" + error)
			toast.error(error.response.data.message);
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (user) {
			navigate("/")
		}
	}, [])

	return (
		<div className='flex justify-center items-center w-screen h-screen '>
			<form onSubmit={signupHandler} className="shadow-xl p-8 flex flex-col gap-5">
				<div className="my-4">
					<img
						className='lg:block pl-4 w-44 flex justify-center m-auto'
						src="/instaLogo.png"
						alt="Logo" />
					<p className='text-sm text-center'>SingUp to see photos and videos for your friends</p>
				</div>
				<div className="">
					<span className="font-medium">Username</span>

					<Input
						type="text"
						name="username"
						value={input.username}
						onChange={chagneEventHandler}
						className="rounded my-1 border border-groove border-gray-500"
					/>
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
						<Button type="submit" className="bg-slate-800 hover:bg-slate-900 rounded text-white text-md">Signup</Button>
					)
				}
				<span className='text-center'>Already have an account? <Link to='/login' className='text-blue-600'>Login</Link></span>
			</form>
		</div>
	)
}

export default Signup
