import  './socket'
import './App.css';
import Navbar from './Components/Navbar';
import React from 'react';
import { useRef } from 'react'
import {BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Login from './Components/Login';
import Signup from './Components/Signup';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, Zoom } from 'react-toastify'

function App() { 
  const appBody = useRef(null);
  return (
    <>
    <ToastContainer
					hideProgressBar={true}
					autoClose={1000}
					transition={Zoom}
					position={'top-center'}
				/>
    <Router basename='/'>
      <Routes>
      <Route path='/' element={<Navbar appBody={appBody} /> } />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
