import React, { useState } from 'react'
import assets from '../assets/assets'
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [agreeChecked, setAgreeChecked] = useState(false)
  const [formData, setFormData] = useState(null)


  const {login} = useContext(AuthContext);


  const handleToggle = () => {
    setIsLogin(!isLogin)
    // Reset all fields when switching
    setFullName('')
    setEmail('')
    setPassword('')
    setBio('')
    setAgreeChecked(false)
    setFormData(null)
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  
    if (!email || !password || (!isLogin && (!fullName || !bio))) {
      toast.error("⚠️ Please fill all required fields.");
      return;
    }
    
    if (!isLogin && !agreeChecked) {
      toast.error("⚠️ Please agree to the terms & privacy policy.");
      return;
    }
    
  
    const credentials = {
      email,
      password,
      ...(isLogin ? {} : { fullName, bio }),
    };
  
    await login(isLogin ? "login" : "signup", credentials);
  };
  
  return (
    <div className='min-h-screen flex flex-col lg:flex-row lg:gap-50 gap-30 items-center justify-center bg-gradient-to-br from-black via-[#3c3a47] to-black text-white font-sans px-4'>

      
      <img 
        src={assets.logo_big} 
        alt="Logo"
        className='w-40 h-40 xl:w-56 '
      />

      {/* Form Card */}
      <div className='flex flex-col items-center gap-4'>
        <div className='bg-transparent  p-5 rounded-xl w-[350px]  shadow-lg border border-gray-600'>

          <h2 className='text-xl mb-4 font-medium text-center'>
            {isLogin ? 'Login' : 'Create Account'}
          </h2>

          <form className='flex flex-col gap-4' onSubmit={onSubmitHandler}>
            {!isLogin && (
              <>
                <input
                  type='text'
                  placeholder='Full Name'
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className='p-3 rounded-md bg-black/30 border border-gray-700 text-white placeholder-gray-400 outline-none'
                />
                <input
                  type='text'
                  placeholder='Bio'
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className='p-3 rounded-md bg-black/30 border border-gray-700 text-white placeholder-gray-400 outline-none'
                />
              </>
            )}
            <input
              type='email'
              placeholder='Email Address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='p-3 rounded-md bg-black/30 border border-gray-700 text-white placeholder-gray-400 outline-none'
            />
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='p-3 rounded-md bg-black/30 border border-gray-700 text-white placeholder-gray-400 outline-none'
            />

            {!isLogin && (
              <div className='flex items-center gap-2 text-xs text-gray-400'>
                <input
                  type='checkbox'
                  checked={agreeChecked}
                  onChange={(e) => setAgreeChecked(e.target.checked)}
                />
                <p>Agree to the terms of use & privacy policy.</p>
              </div>
            )}

            <button
              type='submit'
              className='bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 transition text-white py-2 rounded-md font-medium'
            >
              {isLogin ? 'Login Now' : 'Sign Up'}
            </button>
          </form>

          <p className='text-center mt-4 text-sm text-gray-400'>
            {isLogin ? "Create an account?" : "Already have an account?"}{' '}
            <span
              onClick={handleToggle}
              className='text-purple-400 cursor-pointer font-medium'
            >
              Click here
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
