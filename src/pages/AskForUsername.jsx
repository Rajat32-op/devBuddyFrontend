import { useEffect, useState } from "react";
import LetterGlitch from "../components/LetterGlitchBg";
import {FadeInView,ScaleAndBlur} from '../components/Animations'
import { useNavigate,useLocation } from "react-router-dom";

const AskForUsername = () => {
  const [username, setUsername] = useState("");

  const location=useLocation();
  const navigate=useNavigate();

  useEffect(()=>{
    if(!location.state?.from){
      navigate('/login')
    }
  },[location,navigate])
  const handleSubmit = async(e) => {
    e.preventDefault();
    // handle username submission logic here
    const data={username:e.target.elements.username.value}
    let res=await fetch('http://localhost:3000/addUserName-google',{
      method:'PATCH',
      body:JSON.stringify(data),
      credentials:'include',
      headers:{'Content-Type':'application/json'}
    })
    res=await res.json()
    if(res.message==="Login successful"){
      navigate('/')
    }
    else{
      navigate('/askForUsername',{state:{from:'again'}})
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center relative overflow-hidden bg-black">
      {/* Glitch Background */}
      <div className="absolute inset-0 z-0 opacity-90">
        <LetterGlitch
          glitchSpeed={50}
          centerVignette={true}
          outerVignette={false}
          smooth={true}
        />
      </div>
        <div className="flex flex-col gap-10 items-center">
        <ScaleAndBlur>
        <h1 className="text-7xl z-10 font-bold bg-black/60 backdrop-blur-lg shadow-white/10 drop-shadow-2xl rounded-2xl text-white mb-4 text-center">
          Welcome To Devbuddy!
        </h1>
        </ScaleAndBlur>
      <FadeInView duration={0.7}>

      <form
        onSubmit={handleSubmit}
        className="z-10 relative bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md"
        >
        <p className="text-black text-md mb-6 text-center">
          Please choose a username to complete your signup.
        </p>

        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 mb-4 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your username"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300"
          >
          Continue
        </button>
      </form>
    </FadeInView>
      
    </div>
    </div>
  );
};

export default AskForUsername;
