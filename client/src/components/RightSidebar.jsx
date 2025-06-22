import React from 'react'
import assets, { imagesDummyData } from '../assets/assets'

const RightSidebar = ({ selectedUser, setSelectedUser }) => {
  return selectedUser && (
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-auto max-h-screen px-4 py-6 ${selectedUser ? "max-md:hidden" : ""}`}>
      
      {/* Profile Section */}
      <div className='pt-10 flex flex-col items-center gap-3 text-sm font-light'>
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          className='w-24 aspect-square rounded-full object-cover shadow-lg'
          alt='User profile'
        />

        <h1 className='text-xl font-semibold flex items-center gap-2'>
          <span className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></span>
          {selectedUser.fullName}
        </h1>

        <p className='text-center text-gray-300 max-w-xs'>{selectedUser.bio}</p>
      </div>

      {/* Media Section */}
      <div className='mt-6'>
        <hr className='border-gray-600 my-4' />
        <p className='text-center text-sm uppercase tracking-widest text-gray-300'>Media</p>

        <div className='mt-3 max-h-[200px] overflow-y-auto pr-1 grid grid-cols-2 gap-3 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent'>
          {imagesDummyData.map((url, index) => (
            <div
              key={index}
              onClick={() => window.open(url)}
              className='cursor-pointer rounded overflow-hidden hover:scale-105 transition duration-200'
            >
              <img src={url} className='w-full h-20 object-cover rounded-md' />
            </div>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <button
        className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-violet-700 hover:from-purple-600 hover:to-violet-800 transition duration-300 text-white text-sm font-medium py-2 px-10 rounded-full shadow-md'
      >
        Logout
      </button>
    </div>
  )
}

export default RightSidebar
