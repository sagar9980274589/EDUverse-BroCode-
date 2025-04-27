import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { setpost } from "../PostSlice";
import api from "../AxiosInstance"; 

const useGetAllPosts = () => {
  const reloadTrigger = useSelector((state) => state.posts.reload); 
  const [allposts, setAllPosts] = useState([]);
  const dispatch = useDispatch(); 

  useEffect(() => {
    
    const getAllPosts = async () => {
      try {
        const res = await api.get("/user/getallpost");
        if (res.data.success) {
          setAllPosts(res.data.posts);
          dispatch(setpost(res.data.posts));
        } else {
          console.log(res.data.message);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getAllPosts();
  }, [dispatch,reloadTrigger]); 

  return allposts; 
}
export default useGetAllPosts; 
