import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../chatSlice";
import api from "../AxiosInstance"; 

const useGetmessages = () => {
  const selectedUser = useSelector((state) => state.data.selectedUser);
  const dispatch = useDispatch();

  useEffect(() => {
    // Ensure selectedUser exists before making the API call
    if (!selectedUser) return;

    const getmessages = async () => {
      try {
        const res = await api.get(`/user/getmessages/${selectedUser}`);
        if (res.data.sucess) {
         
          dispatch(setMessages(res.data.messages));
        } else {
         
          dispatch(setMessages(res.data.messages));
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    getmessages();
  }, [selectedUser, dispatch]);  

};
export default useGetmessages;
