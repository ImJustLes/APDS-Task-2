import './App.css'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './components/signup'
import Login from './components/login'
import Payement from './components/payement' 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/payement' element={<Payement/>} />
      </Routes>
    </Router>
  )
}

export default App
