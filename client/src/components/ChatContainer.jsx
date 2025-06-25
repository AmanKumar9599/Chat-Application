import React, { useContext, useEffect, useRef, useState } from 'react';
import assets from '../assets/assets';
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState('');
  const scrollEnd = useRef();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    await sendMessage({ text: input.trim() });
    setInput('');
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Select a valid image file');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({});
    }
  }, [messages]);

  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      {/* Header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} className='w-8 h-8 rounded-full ' alt="User" />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser?.fullName || "Unknown"}
          {onlineUsers.includes(selectedUser._id) && (
            <span className='w-2 h-2 rounded-full bg-green-500'></span>
          )}
        </p>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="Back" className='md:hidden max-w-7 cursor-pointer' />
        <img src={assets.help_icon} alt="Help" className='max-md:hidden max-w-5' />
      </div>

      {/* Chat Messages */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
            {msg.image ? (
              <img src={msg.image}  className='max-w-[230px] max-h-[200px] object-cover border border-gray-700 rounded-lg overflow-hidden mb-8' alt="Chat" />
            ) : (
              <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                {msg.text}
              </p>
            )}
            <div className='text-center text-xs'>
            <img
  className='w-7 h-7 rounded-full'
  src={
    msg.senderId === authUser._id
      ? selectedUser?.profilePic || assets.avatar_icon
      : authUser?.profilePic || assets.avatar_icon
  }
  alt="Avatar"
/>

              <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Input Field */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
          <input
            type='text'
            placeholder='Send a message'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
            className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent'
          />
          <input onChange={handleSendImage} type='file' id='image' accept='image/*' hidden />
          <label htmlFor='image'>
            <img src={assets.gallery_icon} className='w-5 mr-2 cursor-pointer' alt="Upload" />
          </label>
        </div>
        <img onClick={handleSendMessage} src={assets.send_button} className='w-7 cursor-pointer' alt="Send" />
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} className='max-w-16' alt="Logo" />
      <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
