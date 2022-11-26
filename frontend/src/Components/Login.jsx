import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import messageCleaner from '../utils/messageCleaner';

export default function Login() {
	const [formData, setFormData] = useState({
		username: '',
		password: ''
	});
	const navigate = useNavigate();
	const login = async () => {
		try {
			const res = await fetch(
				'https://dailgurmatclasses.herokuapp.com/api/auth/login',
				{
					method: 'POST',
					body: JSON.stringify(formData),
					headers: {
						'content-type': 'application/json',
					},
				},
			);
			const data = await res.json();
			if(res.status===200)
			{
				localStorage.setItem('x-auth-token',res.headers.get('x-auth-token'));
				localStorage.setItem('username',data.username);
				 toast.success(data.message, {
						toastId: 'login',
					});
				navigate('/')
			}
			else{
								 toast.error(messageCleaner(data.message), {
										toastId: 'login',
									});

			}
		} catch (err) {
		         console.log(err);
		         toast.error(messageCleaner(err),{toastId:'loginerror'})
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		login()
	};
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
  const [showPassword, setShowPassword] = useState(false);
	return (
		<form className='login' onSubmit={handleSubmit}>
			<div
				style={{
					textAlign: 'center',
					fontWeight: 'bold',
					position: 'absolute',
					top: '17px',
				}}>
				Login
			</div>
			<span>
				<strong>Username:</strong>
				<input name='username' onChange={handleChange} required />
			</span>
			<span style={{ position: 'relative' }}>
				<strong>Password:</strong>
				<input
					name='password'
					type={showPassword ? 'text' : 'password'}
					onChange={handleChange}
					required
					className='password'
				/>
				<i
					class='fa fa-eye'
					aria-hidden='true'
					style={{
						position: 'absolute',
						bottom: '28px',
						right: '28px',
						cursor: 'pointer',
					}}
					onClick={() => setShowPassword(!showPassword)}></i>
			</span>
			<div
				style={{
					position: 'absolute',
					bottom: '7px',
					display: 'flex',
					justifyContent: 'space-around',
					alignItems: 'center',
					width: '100%',
					height: '40px',
				}}>
				<div
					style={{ fontSize: '17px', color: 'blue', textDecoration: 'underline' }}>
					<Link to='/signup'>Signup? </Link>
				</div>
				<button
					style={{
						width: '90px',
						backgroundColor: 'blue',
						fontSize: '17px',
						height: '29px',
						display: 'flex',
						color: 'white',
						justifyContent: 'center',
						alignItems: 'center',
						textAlign: 'center',
						fontWeight: 'bold',
						borderRadius: '20px',
						border: 'none',
						cursor: 'pointer',
					}}
					type='submit'>
					Login
				</button>
			</div>
		</form>
	);
}
