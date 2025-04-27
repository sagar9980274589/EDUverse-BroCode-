import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    userdata: {},
    token: "",
    selectedUser:null,
  };

const UserSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
         setuser:(state,action)=>{
            state.userdata=action.payload
            
         },
         settoken:(state,action)=>{
           
            state.token=action.payload;
    
         },
         setSelectedUser:(state,action)=>{
        
          state.selectedUser=action.payload;
    
       },

        
    }
})
export const {setuser,settoken,setSelectedUser} = UserSlice.actions
export default UserSlice.reducer