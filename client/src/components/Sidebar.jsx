import React, { useState, useEffect, useContext } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { getUsers, selectedUser, setSelectedUser, users, unseenMessages, setUnseenMessages } = useContext(ChatContext);
  const { logout, onlineUsers,authUser } = useContext(AuthContext);

  const [input, setInput] = useState('');
  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;
   

  useEffect(() => {
    getUsers();
  }, [onlineUsers,authUser]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    // reset unseen message count for this user
    setUnseenMessages(prev => ({
      ...prev,
      [user._id]: 0
    }));
  };

  return (
    <div className={`bg-[#8185B2]/10 h-full p-1 m-2 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ''}`}>
      
      {/* Top Logo and Menu */}
      <div className='flex justify-between items-center'>
        <img src={assets.logo} className='max-w-40' alt="Logo" />
        <div className='relative py-2 group'>
          <img src={assets.menu_icon} className='w-6 h-6 cursor-pointer' alt="Menu" />
          <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
            <p onClick={() => navigate('/profile')} className="cursor-pointer text-sm">Edit Profile</p>
            <hr className="my-2 border-t border-gray-500" />
            <p onClick={logout} className="cursor-pointer text-sm">Logout</p>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
        <img src={assets.search_icon} className='w-3' alt="Search" />
        <input
          onChange={(e) => setInput(e.target.value)}
          type='text'
          className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1'
          placeholder='Search user'
        />
      </div>

      {/* User list */}
      <div className='flex flex-col mt-5'>
        {filteredUsers.map((user, index) => (
          
          <div
          onClick={() => handleUserClick(user)}
          key={index}
          className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id ? 'bg-[#282142]' : ''}`}
          >
           <img
  src={
    user?.profilePic
      ? `${user.profilePic}?v=${Date.now()}`
      : assets.avatar_icon
  }
  className='w-[35px] aspect-[1/1] rounded-full'
  alt="User"
/>

            <div className='flex flex-col leading-5'>
              <h2>{user.fullName}</h2>
              {onlineUsers.includes(user._id) ? (
                <span className='text-green-400 text-xs'>Online</span>
              ) : (
                <span className='text-neutral-400 text-xs'>Offline</span>
              )}
            </div>

            {unseenMessages &&
 user._id &&
 Object.keys(unseenMessages).length > 0 &&
 unseenMessages[user._id] > 0 && (
  <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50 '>
    {unseenMessages[user._id]}
  </p>
)}

          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
