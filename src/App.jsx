import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import './App.css'
import Signup  from './pages/signup'
import Home from './pages/home'
import Login from './pages/login'
import AskForUsername from './pages/AskForUsername'

function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
            <Route index path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/askForUsername' element={<AskForUsername/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
