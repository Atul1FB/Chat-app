import React, { useState, useContext } from 'react';
import assets from '../assets/assets';
import { AuthContext } from '../../Context/AuthContext';

function Login() {
  const [currentState, setCurrentState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false); 

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast.error("Please agree to the terms of use & privacy policy");
      return;
    }

    if (currentState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    login(currentState === "Sign up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio
    });
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-1xl">

      {/* LEFT */}
      <img src={assets.logo_big} alt="logo" className="w-[min(30vw,300px)]" />

      {/* RIGHT */}
      <form onSubmit={onSubmitHandler} className="border border-violet-500 bg-white/10 text-white border-gray-500 p-8 flex flex-col gap-3 rounded-[5%] shadow-lg backdrop-blur-2xl w-90">

        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currentState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt="arrow"
              className="w-5 cursor-pointer bg-white rounded-xl"
            />
          )}
        </h2>

        {currentState === "Sign up" && !isDataSubmitted && (
          <input
            type="text"
            placeholder='Full Name'  
            required
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            className='p-2 border border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none'
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              type="email"
              placeholder='Email'  
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='p-2 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
            <input
              type="password"
              placeholder='Password' 
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='p-2 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
          </>
        )}

        {currentState === "Sign up" && isDataSubmitted && ( 
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className='p-2 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Provide a short bio...'
          />
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white hover:opacity-90 rounded-xl cursor-pointer transition" // ✅ hover:bg-violet-900 doesn't work on gradients
        >
          {currentState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className='flex items-center gap-2 text-sm text-violet-200'>
          <input
            type="checkbox"
            checked={agreedToTerms}                           //  controlled checkbox
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
          <p>Agree to the terms of use & privacy policy</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currentState === "Sign up" ? (
            <p className='text-sm text-white'>Already have an account?
              <span
                onClick={() => { setCurrentState("Login"); setIsDataSubmitted(false); }}
                className='ml-2 font-medium text-violet-500 cursor-pointer'>
                Login here
              </span>
            </p>
          ) : (
            <p className='text-sm text-white'>Don't have an account?
              <span
                onClick={() => setCurrentState("Sign up")}
                className='font-medium cursor-pointer ml-2 text-violet-500'>
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default Login;