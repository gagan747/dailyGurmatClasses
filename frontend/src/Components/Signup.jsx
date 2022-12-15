import hostUrl from '../config'
import React from 'react';
import { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import messageCleaner from '../utils/messageCleaner'; 

export default function Signup() {
	const navigate = useNavigate()
	const [ formData,setFormData ] = useState({
		username:'',
		password:'',
		city:'',
		fullname:''
	});
	const [ showPassword,setShowPassword ] = useState(false);
	const signup = async() => {
		try{
		 const res = await fetch(
				`${hostUrl}/api/auth/register`,
				{
					method: 'POST',
					body: JSON.stringify(formData),
					headers: {
						'content-type': 'application/json',
					},
				},
			);
		 const data = await res.json();
		 if (res.status === 201) {
				localStorage.setItem('x-auth-token', res.headers.get('x-auth-token'));
				localStorage.setItem('username', data.username);
				toast.success(data.message, {
					toastId: 'login',
				});
				navigate('/');
			} else {
				toast.error(messageCleaner(data.message), {
					toastId: 'login',
				});
			}
		}catch(err){
			console.log(err);
			  toast.error(messageCleaner(err), { toastId: 'signuperror' });
		}
	}
	const handleSubmit = (e) => {
 e.preventDefault();
 signup();
	}
	const handleChange = (e) => {
	setFormData({...formData,[e.target.name]:e.target.value})	
	}
	return (
		<form className='signup' onSubmit={handleSubmit}>
			<div
				style={{
					textAlign: 'center',
					fontWeight: 'bold',
					position: 'absolute',
					top: '17px',
				}}>
				Sign Up
			</div>
			<span>
				<strong>Username:</strong>
				<input name='username' onChange={handleChange} required />
			</span>
			<span>
				<strong>Fullname:</strong>
				<input name='fullname' onChange={handleChange} required />
			</span>
			<span>
				<strong>City:</strong>
				<input name='city' onChange={handleChange} required />
			</span>
			<span style={{position:'relative'}}>
				<strong>Password:</strong>
				<input name='password' type={showPassword?'text':'password'} onChange={handleChange} required className='password'/>
				<i class='fa fa-eye' aria-hidden='true' style={{position:'absolute',bottom:'28px',right:'28px',cursor:'pointer'}} onClick={()=>setShowPassword(!showPassword)}></i>
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
					<Link to='/login'>Login? </Link>
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
					Sign Up
				</button>
			</div>
		</form>
	);
}
