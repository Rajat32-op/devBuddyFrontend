import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { FadeInView } from '../components/Animations'


function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate()
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
      navigate('/askForUsername',{state:{from:'login'}});
    }
    else{
      navigate('/signup');
    }
  }

  const handleSubmit = async e => {
    e.preventDefault();
    // Call backend API to signup
    const data = {
      username: e.target.elements.username.value,
      password: e.target.elements.password.value
    }
    console.log(data)
    const response = await fetch("http://localhost:3000/login", {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
      credentials: "include"
    })
    const result = await response.json()
    if (result.message == "Login successful") {
      navigate('/')
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative">
      {/* Background Image with opacity */}
      <div className="bg-[url('/bg_login.png')] bg-center opacity-70 z-0 absolute inset-0"></div>

      {/* Foreground Form */}
      <FadeInView>

        <form onSubmit={handleSubmit} className=" bg-black/50 backdrop-blur-md relative p-6 rounded shadow w-96 z-10 ring-2 ring-black/10">
          <h2 className="text-2xl text-white font-bold mb-4">Log In</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="text-white border p-2 w-full mb-2 rounded-2xl"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="text-white border p-2 w-full mb-4 rounded-2xl"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 my-2 cursor-pointer text-white py-2 px-4 rounded w-full"
          >
            Log In
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
          <button className='bg-transparent text-blue-300 hover:text-blue-400 text-md cursor-pointer' onClick={() => { navigate('/signup') }}>Don't have an account? Create new account</button>
        </form>
      </FadeInView>
    </div>

  );
}

export default Login;
