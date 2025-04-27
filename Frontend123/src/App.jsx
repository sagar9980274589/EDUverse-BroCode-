import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./socketSlice"; // Manage socket state in Redux
import { setOnlineUsers, addMessage } from "./chatSlice"; // Manage chat state
import io from "socket.io-client";
import { Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Myprofile from "./components/Myprofile";
import Chatpage from "./components/Chatpage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchPage from "./components/search/SearchPage";
import GetFacialData from "./components/facialDataRegister/GetFacialData";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.data.userdata); // Get user from Redux
  const socketRef = useRef(null); // Store socket reference

  useEffect(() => {
    if (user && user._id && !socketRef.current) {
      console.log("🔌 Connecting socket...");

      const socketio = io("http://localhost:3000", {
        query: { userId: user._id },
        transports: ["polling", "websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
      });

      socketRef.current = socketio; // Store in ref to prevent re-renders
      dispatch(setSocket(socketio)); // Store in Redux

      socketio.on("connect", () => {
        console.log("✅ Socket connected");
      });

      socketio.on("getonlineusers", (onlineusers) => {
        dispatch(setOnlineUsers(onlineusers));
      });

      socketio.on("newMessage", (newMessage) => {
        dispatch(addMessage(newMessage));
      });

      return () => {
        // console.log("❌ Disconnecting socket...");
        // toast.error("Please reload, ❌ Disconnecting socket...");
        // socketio.disconnect();
        // socketRef.current = null; // Reset ref
        // dispatch(setSocket(null)); // Reset Redux state
      };
    }
  }, [user, dispatch]); // ✅ Removed `socket` from dependencies

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<ProtectedRoute><Sidebar /></ProtectedRoute>}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Myprofile />} />
          <Route path="/chat" element={<Chatpage />} />
          <Route path="/search" element={<SearchPage/>} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/facialData" element={<GetFacialData/>} />
      </Routes>
    </>
  );
}

export default App;
