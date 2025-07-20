import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import './App.css'
import Signup  from './pages/signup'
import Home from './pages/home'
import Login from './pages/login'
import AskForUsername from './pages/AskForUsername'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import Notifications from './pages/Notifications'
import Navbar from './components/Navbar'

function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
            <Route index path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/askForUsername' element={<AskForUsername/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/chat' element={<Chat/>}/>
            <Route path='/notifications' element={<Notifications/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
