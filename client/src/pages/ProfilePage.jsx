import React, { useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import assets from '../assets/assets'

const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState(null)
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [profileData, setProfileData] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfileImage(URL.createObjectURL(file)) // just preview
      // for backend: send `file` as FormData
    }
  }

  const handleSave = () => {
    const data = {
      fullName,
      bio,
      profileImage,
    }
    setProfileData(data)
    console.log('✅ Profile Saved:', data)
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-black px-4'>
      <div className='flex flex-col md:flex-row bg-white/5 backdrop-blur-md border border-gray-600 rounded-xl p-6 md:p-10 gap-6 md:gap-12 shadow-xl text-white max-w-4xl w-full'>

        {/* Form Section */}
        <div className='flex-1 space-y-5'>
          <h2 className='text-lg font-semibold mb-3'>Profile details</h2>

          {/* Profile Upload */}
          <div className='flex flex-col items-start gap-2'>
            {profileImage ? (
              <img src={profileImage} alt="Profile" className='w-16 h-16 rounded-full object-cover' />
            ) : (
              <FaUserCircle size={64} className='text-gray-400' />
            )}
            <label className='text-sm text-purple-400 cursor-pointer'>
              <input type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
              Upload profile image
            </label>
          </div>

          {/* Name */}
          <input
            type='text'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder='Full Name'
            className='w-full p-3 rounded-md bg-black/20 border border-gray-700 placeholder-gray-400 outline-none'
          />

          {/* Bio */}
          <textarea
            rows='3'
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder='Write something about yourself...'
            className='w-full p-3 rounded-md bg-black/20 border border-gray-700 placeholder-gray-400 outline-none resize-none'
          />

          {/* Save Button */}
          <button
            onClick={handleSave}
            className='w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 transition text-white py-2 rounded-full font-medium cursor-pointer'
          >
            Save
          </button>
        </div>

        {/* Logo Section */}
        <div className='hidden md:flex items-center justify-center flex-1'>
          <img src={assets.logo_icon}></img>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
