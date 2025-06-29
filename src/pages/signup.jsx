import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { FadeInView } from '../components/Animations'
import { nav } from 'framer-motion/client';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoogleSignup = async (token) => {
    const response = await fetch("http://localhost:3000/google-signup", {
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: { 'Content-Type': 'application/json' },
      credentials:'include'
    })
    const result = await response.json();
    if(result.message=="Login successful"){
      navigate('/askForUsername',{state:{from:'Signup'}});
    }
    else{
      navigate('/signup');
    }
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const data = {
      name: e.target.elements.name.value,
      username: e.target.elements.username.value,
      email: e.target.elements.email.value,
      password: e.target.elements.password.value
    }
    console.log(data)
    const response = await fetch("http://localhost:3000/signup", {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
    const result = await response.json()
    if (result.message == "Login successful") {
      navigate('/')
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-center relative">
      <div className='absolute bg-[url(/bg_signup.png)] bg-center bg-cover opacity-60 z-0 inset-0'></div>
      <FadeInView>

        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md p-6 border border-white/30 rounded shadow-xl w-96 relative flex flex-col">
          <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="border-2 p-2 w-full mb-2 rounded-4xl "
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="border-2 p-2 w-full mb-2 rounded-4xl "
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="border-2 p-2 w-full mb-2 rounded-4xl"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="border-2 p-2 w-full mb-4 rounded-4xl"
          />
          <button type="submit" className="bg-green-600 text-white my-2 py-2 px-4 hover:bg-green-500 cursor-pointer transition-all duration-100 ease-in-out  rounded w-full">
            Sign Up
          </button>
          <GoogleOAuthProvider clientId="215751656376-24vomoq01h0qhlodv3h7qc3u2rjiiidv.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={credentialResponse => {
                handleGoogleSignup(credentialResponse.credential)
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </GoogleOAuthProvider>
          <button className='bg-transparent text-black hover:text-gray-700 text-md cursor-pointer' onClick={() => { navigate('/login') }}>Already have an account? Log in</button>

        </form>
      </FadeInView>
    </div>
  );
}

export default Signup;
