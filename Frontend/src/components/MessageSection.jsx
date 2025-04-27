import React from 'react'
import useGetmessages from '../hooks/getmessages';

import { useSelector } from 'react-redux';
const MessageSection = ({selectedUser}) => {
  


  const messages=useSelector((state)=>state.chat.messages);
  const uniqueMessages = [...new Map(messages.map((msg) => [msg._id, msg])).values()];



 
const loggeduserid = useSelector((state) => state.data.userdata._id);
  return (
  <>
  <div className="userinfo flex justify-center items-center flex-col">
  <div className="w-24 h-24 mt-8 rounded-full overflow-hidden ">
            <img src={selectedUser.profile || null} alt="Profile" className="w-full h-full object-cover" />

          </div>
          <span>{selectedUser.fullname} </span>
          <span>{selectedUser.username} </span>
          <button className='rounded-md bg-slate-100 px-3 py-1 mt-2'>View Profile</button>
  </div>
  <div  className="messages  h-[60%] overflow-y-scroll flex flex-col">
{

    uniqueMessages &&  uniqueMessages.map(
        (elem,idx)=>{
           return (
           <span key={idx} className={`flex  w-full p-4 rounded-2xl  ${elem.senderId==loggeduserid?"justify-end":"justify-start"}   `} >
<span className={`p-4 rounded-2xl ${elem.senderId==loggeduserid?"justify-end text-white bg-blue-500":"justify-start bg-slate-300"}`}>{elem.message}</span>
           </span>
           
           
           )
        }
        )
}
  </div>
  </>
  )
}

export default MessageSection