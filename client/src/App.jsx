import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from "./Pages/Home"
import Login from "./Pages/Login"
import Profile from "./Pages/Profile"
import { Toaster } from "react-hot-toast"
import { AuthContext } from '../Context/AuthContext';

function App() {
  const { authUser, isCheckingAuth } = useContext(AuthContext) // ✅ add loading state

  // ✅ Don't render routes until auth check is complete
  if (isCheckingAuth) return null; 

  return (
    <div className='bg-[url("./assets/bgImage.svg")] bg-no-repeat h-screen'> {/* ✅ fixed path + h-screen */}
      <Toaster />
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;