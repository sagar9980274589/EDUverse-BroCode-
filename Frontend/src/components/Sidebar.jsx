import React, { useEffect, useState } from 'react'
import logo from '../assets/memoria.png'
import "@fontsource/material-symbols-outlined";

import { useSelector } from 'react-redux';

import { useNavigate, Outlet } from 'react-router-dom';
import Createdialogue from './Createdialogue';


const Sidebar = () => {
const navigate=useNavigate();
 const userdata = useSelector((state) => state.data.userdata);
  
    const [profile,setprofile]=useState(null);

    const [createopen,setcreateopen]=useState(false)
useEffect(()=>{

setprofile(userdata.profile)

},[])




const navitems=[
    {
        icon:(<span className="material-symbols-outlined">home</span>)
        ,
        text:"home"
    },
    {
        icon:(<span className="material-symbols-outlined">
            search
            </span>)
        ,
        text:"search"
    },
    {
        icon:(<span className="material-symbols-outlined">
            explore
            </span>)
        ,
        text:"explore"
    },
    // {
    //     icon:(
    //         <span className="material-symbols-outlined">
    //     animated_images
    //     </span>)
    //     ,
    //     text:"reels"
    // },
    {
        icon:(
            <span className="material-symbols-outlined">
chat
</span>)
        ,
        text:"messages"
    },
    {
        icon:(
         
<span className="material-symbols-outlined">
favorite
</span>)
        ,
        text:"notifications"
    },
    {
        icon:(
         
<span className="material-symbols-outlined">
add_box
</span>)
        ,
        text:"create"
    },
    // {
    //     icon:(
         
    //         <span className="material-symbols-outlined">
    //         insert_chart
    //         </span>)
    //     ,
    //     text:"dashboard"
    // },
    {
        icon:(<>
          <div className="w-10 h-10 rounded-full overflow-hidden">
        <img src={profile||null} alt="Profile" className="w-full h-full object-cover"/>
    </div>
        
        </>)
        ,
        text:"profile"
    },
    {
        icon:(
         
            <span className="material-symbols-outlined">
            logout
            </span>)
        ,
        text:"Logout"
    },

];

function sidebarhandler(text){

if(text=="logout"){
    localStorage.removeItem('token');
    localStorage.removeItem('persist:root')
    navigate('/login');
}
else if(text=="create"){
   setcreateopen(true);
}
else if(text=="profile"){
    navigate('/profile')
 }
 else if(text=="home"){
    navigate('/')
 }
 else if(text=="messages"){
    navigate('/chat')
 }
 else if(text=="search"){
    navigate('/search')
 }
}




  return (
    <>
   
    <div className="app flex w-full h-screen overflow-hidden">
    <div className='inline-block w-[16%] h-screen border-r-2 border-slate-300'
    ><div className="logo h-[15%] w-full flex justify-start items-center " >
        <img className=" h-[100%] mt-6 mx-6" src={logo}/>
        </div>
        <div className="options h-[80%] mt-14 flex flex-col items-start">
     {
        navitems.map((item,idx)=>{
            
return <button onClick={()=>{sidebarhandler(item.text.toLowerCase())}} className="cursor-pointer flex justify-center  mx-4 gap-1.5 h-[10%]" key={idx}><span className='h-10'>{item.icon}</span><span className='capitalize text-slate-600 font-medium'>{item.text}</span></button>
        })
     }

        </div>
        </div>
        <Outlet />
        <Createdialogue isOpen={createopen} setIsOpen={setcreateopen}/>
        </div>
        </>
  )
}

export default Sidebar