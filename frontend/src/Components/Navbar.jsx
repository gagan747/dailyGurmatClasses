import React from 'react';
import {useNavigate} from 'react-router-dom'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import messageCleaner from '../utils/messageCleaner';
import { useState, useEffect } from 'react'
import { socket } from '../socket';

function Navbar() {
	const navigate = useNavigate();
	const [userBookingsLength,setUserBookingsLength] = useState(0);
	const [userBookedAshtpadi,setUserBookedAshtpadi] = useState(null);
	const [pathDuties, setPathDuties] = React.useState([]);
	const [pathDutiesModal, setPathDutiesModal] = React.useState(false);
	const [bookedByModal, setBookByModal ] = useState({});
	const [cancelDuty,setCancelDuty ] = useState({});
	const [width, setWidth] = useState(window.innerWidth);
	const [bookLoader, setBookLoader ] = useState({
	});
	useEffect(()=>{
          socket.on('callFetchPathDuties',()=>fetchPathDuties())
		window.addEventListener('resize', updateWindowSize);
		return () => {
			socket.off('callFetchPathDuties');
			window.removeEventListener('resize', updateWindowSize);
		}
	},[])
	const fetchPathDuties = async () => {
		try{
		const res = await fetch('https://dailgurmatclasses.herokuapp.com/api/pathDuties');
		const data = await res.json();
		const userBookings = data.duties.filter((duty)=>{
		return localStorage.getItem('username') && (duty.booked?.bookedBy?.username === localStorage.getItem('username'))
		});
		setUserBookingsLength(userBookings.length);
		setUserBookedAshtpadi(userBookings.length === 1 ? userBookings[0].ashtpadi : null);
		return setPathDuties(data.duties);
		}
		catch(err){
			toast.error(messageCleaner(err), { toastId: 'navbarerror' });
		}
	};
function updateWindowSize() {
	if (window.innerWidth) {
		setWidth(window.innerWidth);
	}
}

	const handleUnbook = async (ashtpadi,user_id) => {
		try {
			const res = await fetch('https://dailgurmatclasses.herokuapp.com/api/pathDuties', {
				method: 'DELETE',
				body: JSON.stringify({
					ashtpadi,user_id
				}),
				headers: {
					'content-type': 'application/json',
					token: localStorage.getItem('x-auth-token'),
				},
			});
			const data = await res.json();
			if(res.status.toString().startsWith('2'))
			  { toast.success(data.message);
				  socket.emit('onBookAshtpadi');
				return fetchPathDuties();
			  }
			  toast.error(data.message)
		} catch (err) {
			toast.error(messageCleaner(err), { toastId: 'handleUnbookError' });
		}
	};
	const bookAshtpadi = async (ashtpadi) => {
		try{
		if(!localStorage.getItem('x-auth-token'))
                      return navigate('/login');
		  setBookLoader({[ashtpadi]:true})
		const res = await fetch('https://dailgurmatclasses.herokuapp.com/api/pathDuties', {
			method: 'POST',
			body: JSON.stringify({
				ashtpadi,
			}),
			headers: {
				'content-type': 'application/json',
				'token':localStorage.getItem('x-auth-token')
			},
		});
		const data = await res.json();
		if(res.status === 307)
		   return navigate('/login');
		   else if (res.status.toString().startsWith('2')){
		    toast.success(messageCleaner(data.message),{toastId:'navbar'});
		   await fetchPathDuties();
		     setBookLoader({ [ashtpadi]: undefined });
		     socket.emit('onBookAshtpadi')
		   return;
		   }
		   else
{
 toast.error(messageCleaner(data.message), { toastId: 'navbarerror' });
 setBookLoader({ [ashtpadi]: undefined });
return;
}		   
	}catch(err){
		toast.error(messageCleaner(err),{toastId:'navbarerror'})
	}
	};
	return (
		<>
			{pathDutiesModal && (
				<div className='pathDutiesModal'>
					<div
						onClick={() => {
							setPathDutiesModal(false);
						}}
						style={{
							cursor: 'pointer',
							position: 'absolute',
							right: '13px',
							top: '8px',
						}}>
						<strong>&#10060;</strong>
					</div>
					<div
						className='pathDuties'
						style={{
							marginTop: '45px',
							height: '350px',

							overflowY: 'scroll',
						}}>
						{pathDuties.map((duty) => {
							return (
								<div
									key={duty.ashtpadi}
									onClick={() => {
										setCancelDuty({});
										setBookByModal({});
									}}>
									<div
										className={`pathDutyDiv ${
											userBookingsLength === 2 && !duty.booked.isBooked
												? 'disabled'
												: userBookingsLength === 1 &&
												  Math.abs(duty.ashtpadi - userBookedAshtpadi) !== 1 &&
												  !duty.booked.isBooked
												? 'disabled'
												: ''
										}`}>
										{cancelDuty[duty.ashtpadi] && (
											<button
												className='cancel-booking'
												onClick={handleUnbook.bind(
													null,
													duty.ashtpadi,
													duty.booked?.bookedBy?._id,
												)}>
												Unbook
											</button>
										)}
										<div
											style={{
												color: '#FF5733',
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												position: 'relative',
												padding: '5px',
												boxSizing: 'border-box',
												fontFamily: 'sans-serif',
												fontSize: '27px',
												fontWeight: 'bold',
											}}>
											<img
												src={require('./Ashtpdi.png')}
												width='120px'
												height='45px'
												style={{ margin: '0', padding: '0' }}
											/>{' '}
											&nbsp;&nbsp;
											{duty.ashtpadi}
										</div>
										{duty.booked?.bookedBy?.username ===
											localStorage.getItem('username') && (
											<i
												className='fas fa-ellipsis-h'
												style={{
													color: 'black',
													position: 'absolute',
													top: '0',
													right: '14px',
												}}
												onClick={(e) => {
													e.stopPropagation();
													setCancelDuty({ [duty.ashtpadi]: true });
												}}></i>
										)}

										{duty.booked.isBooked ? (
											<button
												onClick={(e) => {
													e.stopPropagation();
													setBookByModal({
														[duty.ashtpadi]: !bookedByModal[duty.ashtpadi],
													});
												}}
												style={{
													color: 'white',
													backgroundColor: 'red',
													fontWeight: 'bold',
													boxSizing: 'border-box',
													width: '130px',
													height: '34px',
													padding: '17px',
													display: 'flex',
													fontFamily: 'sans-serif',
													fontSize: '20px',
													justifyContent: 'center',
													alignItems: 'center',
													borderRadius: '20px',
													boxSizing: 'border-box',
													border: 'none',
												}}>
												{bookedByModal[`${duty.ashtpadi}`] && (
													<div className='booked-by'>
														<span
															className='booked-by-cross-icon'
															onClick={() => {
																setBookByModal({ [duty.ashtpadi]: false });
															}}>
															&#10060;
														</span>
														<span style={{ fontStyle: 'italic' }}>ਸੇਵਾ</span>
														<span>
															{duty.booked.bookedBy.fullname +
																'(' +
																duty.booked.bookedBy.city +
																')'}
														</span>
													</div>
												)}
												<span>Booked&nbsp;</span>
												<span>
													<i className='fas fa-angle-down'></i>
												</span>
											</button>
										) : (
											<button
												onClick={() => {
													bookAshtpadi(duty.ashtpadi);
												}}
												className='button'>
												<strong>
													Book{' '}
													{bookLoader[`${duty.ashtpadi}`] && (
														<i class='fa fa-spinner fa-spin' style={{ fontSize: '24px' }}></i>
													)}
												</strong>
											</button>
										)}
									</div>

									<hr />
								</div>
							);
						})}
					</div>
				</div>
			)}

			<div className='navbar'>
				<div className='logo'>
					<span style={{ textAlign: 'center', fontWeight: 'bold' }}>
						Daily Gurmat Classes &nbsp;&nbsp;
					</span>
					<img
						src={require('./nishan_sahib.jpg')}
						width='50px'
						height='50px'
						style={{ margin: '0', padding: '0' }}
					/>
				</div>
				{/* {width < 800 && (
					<span
						onClick={() => {
							if (!pathDutiesModal) fetchPathDuties();
							setPathDutiesModal(!pathDutiesModal);
						}}>
						<strong>
							<i className='fa fa-bars' aria-hidden='true'></i>
						</strong>
					</span>
				)} */}
		
					<ul className='nav-items'>
						<li
							onClick={() => {
								if (!pathDutiesModal) fetchPathDuties();
								setPathDutiesModal(!pathDutiesModal);
							}}>
							<strong>ਸੁਖਮਨੀ ਸਾਹਿਬ ਸੇਵਾ</strong>
						</li>
						{localStorage.getItem('username') ? (
							<>
								<li
									onClick={() => {
										localStorage.removeItem('username');
										localStorage.removeItem('x-auth-token');
										navigate('/');
									}}>
									<strong>Logout</strong>
								</li>
								<li
									style={{
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'center',
										alignItems: 'center',
									}}>
									<i
										className='far fa-user-circle'
										style={{ color: 'white', fontSize: '25px' }}></i>
									&nbsp;&nbsp;
									<strong>{localStorage.getItem('username')}</strong>
								</li>
							</>
						) : (
							<li>
								<Link to='/login' className='login-button-navbar'>
									<strong>Login</strong>
								</Link>
							</li>
						)}
					</ul>
				
			</div>
		</>
	);
}

export default Navbar;
