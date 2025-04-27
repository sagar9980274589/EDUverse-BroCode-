import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    posts:[],
    reload:false
  };

const PostSlice=createSlice({
    name:"post",
    initialState,
    reducers:{
         setpost:(state,action)=>{
            state.posts=action.payload
            
         },
         reload:(state,action)=>{
         
         state.reload=!state.reload
       },

        
    }
})
export const {setpost,reload} = PostSlice.actions
export default PostSlice.reducer