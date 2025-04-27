import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const GetFacialData = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState("👋 Position your face in front of the camera.");
  const [progress, setProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [embeddings, setEmbeddings] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [toastMessage, setToastMessage] = useState("");


  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        console.log("✅ Models loaded successfully!");
        startVideo();
      } catch (error) {
        console.error("❌ Error loading models:", error);
        setMessage("⚠️ Failed to load models. Check console.");
      }
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener("loadedmetadata", () => {
          detectFaces();
        });
      } catch (error) {
        console.error("⚠️ Webcam access denied:", error);
        setMessage("⚠️ Please allow camera access and refresh.");
      }
    };

    const detectFaces = async () => {
      if (scanComplete) return;

      const canvas = faceapi.createCanvasFromMedia(videoRef.current);
      canvasRef.current.innerHTML = "";
      canvasRef.current.appendChild(canvas);

      const displaySize = { width: 400, height: 300 };
      faceapi.matchDimensions(canvas, displaySize);

      const detect = async () => {
        if (scanComplete) return;

        try {
          const detections = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 }))
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (detections) {
            setScanComplete(true);
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

            const facialEmbeddings = detections.descriptor;
            console.log("✅ Facial Embeddings Captured:", facialEmbeddings);

            setEmbeddings(facialEmbeddings);
            setMessage("✅ Scan Successful! Click 'Register' to save.");
            setProgress(100);
            setShowRegister(true);
          } else {
            setMessage("⚠️ No face detected. Adjust your position.");
            setProgress(0);
            requestAnimationFrame(detect);
          }
        } catch (error) {
          console.error("❌ Error during face detection:", error);
          setMessage("⚠️ An error occurred. Please retry.");
        }
      };

      detect();
    };

    loadModels();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [scanComplete]);

  const handleRegister = async () => {
    if (!embeddings || embeddings.length === 0) {
      console.error("❌ No facial data found. Embeddings are missing.");
      setToastMessage("❌ No facial data found. Please retry.");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData) {
      console.error("❌ User data missing from localStorage.");
      setToastMessage("⚠️ User data not found. Please register again.");
      return;
    }

    const payload = {
      ...userData,
      facialEmbeddings: Array.from(embeddings), // Convert Float32Array to normal array
    };

    console.log("📤 Sending Data to Backend:", payload);

    try {
      const response = await axios.post("http://localhost:3000/user/register", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        console.log("✅ User registered successfully!");
        setToastMessage("✅ Registration Successful!");
        if (videoRef.current && videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        }
        toast.success("Registration Successful!", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
            });
        setShowRegister(false);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("❌ Error sending data:", error.response?.data || error.message);
      setToastMessage("⚠️ Registration Failed. Try again.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f5f5f5" }}>
      <div style={{
        width: "450px",
        padding: "20px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        textAlign: "center",
        position: "relative"
      }}>
        <h2 style={{ marginBottom: "10px" }}>Face Registration</h2>

        <div style={{ position: "relative", width: "400px", height: "300px", margin: "auto", borderRadius: "10px", overflow: "hidden", border: "2px solid #ddd" }}>
          <video ref={videoRef} autoPlay muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div ref={canvasRef} style={{ position: "absolute", top: 0, left: 0 }} />
        </div>

        <div style={{ marginTop: "10px", padding: "8px", background: "#222", color: "#fff", borderRadius: "5px", fontSize: "14px" }}>
          {message}
        </div>

        {showRegister && (
          <button onClick={handleRegister} style={{ marginTop: "15px", padding: "10px 15px", fontSize: "16px", background: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Register
          </button>
        )}
      </div>
    </div>
  );
};

export default GetFacialData;