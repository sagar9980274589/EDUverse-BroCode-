import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";


const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

 
  
  const token = localStorage.getItem("token"); 
 

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (!decoded) {
        navigate("/login");
        return;
      }
    } catch (err) {
      console.log("Invalid token:", err);
      navigate("/login");
      return;
    }

  },[navigate,token])
    

 

  return <>{children}</>;
};

export default ProtectedRoute;
