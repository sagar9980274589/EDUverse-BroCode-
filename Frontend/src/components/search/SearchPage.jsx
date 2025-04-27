import React, { useEffect, useState } from "react";
import api from "../../AxiosInstance";
import * as faceapi from "face-api.js";
import axios from "axios";
const SearchPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [image, setImage] = useState(null);
  const [faceEmbeddings, setFaceEmbeddings] = useState(null);
  const [deepAgingEnabled, setDeepAgingEnabled] = useState(false);

  useEffect(() => {
    async function getAllUsers() {
      try {
        const res = await api.get("/user/getsuggested");
        if (res.data.success) {
          setAllUsers(res.data.suggested);
          console.log("✅ Users Fetched:", res.data.suggested);
        } else {
          console.log(res.data.message);
        }
      } catch (err) {
        console.log(err);
      }
    }

    async function loadModels() {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        console.log("✅ Face-api.js models loaded!");
      } catch (error) {
        console.error("❌ Error loading models:", error);
      }
    }

    getAllUsers();
    loadModels();
  }, []);

  const reduceTo128D = (embeddings512D) => {
    if (!embeddings512D || embeddings512D.length !== 512) return null;
    
    // Take only the first 128 values
    return embeddings512D.slice(0, 128);
  };
  


  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    filterResults(value, faceEmbeddings);
  };

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const img = URL.createObjectURL(file);
  setImage(img);

  try {
    console.log("🟡 Extracting facial embeddings...");
    const imgElement = new Image();
    imgElement.src = img;

    imgElement.onload = async () => {
      const detections = await faceapi
        .detectSingleFace(imgElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections) {
        let embeddings = Array.from(detections.descriptor); // 128D embeddings
        console.log("✅ Facial embeddings found (128D):", embeddings);

        // if (deepAgingEnabled) {
        //   console.log("🟡 Sending embeddings for deep aging transformation...");

        //   const response = await fetch("http://localhost:8000/api/deep-aging/transform", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ embeddings }),
        //   });

        //   const data = await response.json();
        //   if (data.success) {
        //     let embeddings512D = data.transformed_embeddings; // Received 512D embeddings
        //     console.log("✅ Deep-aged embeddings received (512D):", embeddings512D);

        //     // 🔥 Reduce 512D to 128D
        //     embeddings = reduceTo128D(embeddings512D);
        //     console.log("✅ Reduced embeddings (128D):", embeddings);
        //   } else {
        //     console.error("❌ Deep aging failed:", data.message);
        //   }
        // }

        setFaceEmbeddings(embeddings); // ✅ Always store 128D embeddings
        filterResults(searchText, embeddings);
      } else {
        console.warn("⚠️ No clear face detected. Please upload a clearer image.");
        setFaceEmbeddings(null);
        setMatchedUsers([]);
      }
    };
  } catch (error) {
    console.error("❌ Error processing image:", error);
  }
};


  
  



  const removeImage = () => {
    setImage(null);
    setFaceEmbeddings(null);
    filterResults(searchText, null);
    document.getElementById("file-upload").value = "";
  };

  const euclideanDistance = (arr1, arr2) => {
    if (!arr1 || !arr2 || arr1.length !== arr2.length) return Infinity;
    return Math.sqrt(arr1.reduce((sum, value, index) => sum + Math.pow(value - arr2[index], 2), 0));
  };

  const filterResults = (text, uploadedEmbeddings) => {
    let filteredUsers = [];

    if (text.trim() !== "") {
      filteredUsers = allUsers
        .filter((user) =>
          user.username.toLowerCase().includes(text.toLowerCase()) ||
          user.fullname.toLowerCase().includes(text.toLowerCase())
        )
        .map((user) => ({ ...user, matchType: "Text Match" }));
    }

    if (uploadedEmbeddings) {
      const faceMatchedUsers = allUsers
        .filter((user) => Array.isArray(user.facialEmbeddings) && user.facialEmbeddings.length === 128)
        .map((user) => ({
          ...user,
          matchScore: euclideanDistance(uploadedEmbeddings, user.facialEmbeddings),
          matchType: "Face Match",
        }))
        .sort((a, b) => a.matchScore - b.matchScore);

      if (filteredUsers.length > 0) {
        const mergedUsers = faceMatchedUsers.map((faceUser) => {
          const textMatch = filteredUsers.find((textUser) => textUser._id === faceUser._id);
          if (textMatch) {
            return { ...faceUser, matchType: "Text & Face Match" };
          }
          return faceUser;
        });

        filteredUsers = [...mergedUsers, ...filteredUsers.filter((textUser) => !faceMatchedUsers.some((f) => f._id === textUser._id))];
      } else {
        filteredUsers = faceMatchedUsers;
      }
    }

    setMatchedUsers(filteredUsers);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Search Users</h1>

        <div className="flex items-center bg-gray-200 rounded-lg p-3 mb-4 gap-1">
          <input
            onChange={handleSearch}
            value={searchText}
            className="flex-1 bg-transparent text-lg outline-none px-3"
            type="text"
            placeholder="Enter username or full name..."
          />
          <input type="file" accept="image/*" className="hidden" id="file-upload" onChange={handleImageUpload} />
          <label htmlFor="file-upload" className="cursor-pointer px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Upload Image
          </label>
          {/* <label className="ml-3 flex items-center space-x-2">
            <input type="checkbox" checked={deepAgingEnabled} onChange={() => setDeepAgingEnabled(!deepAgingEnabled)} />
            <span className="text-sm text-gray-700">Enable Deep Aging</span>
          </label> */}
        </div>

        {image && (
          <div className="flex flex-col items-center">
            <img src={image} alt="Uploaded" className="w-40 h-40 object-cover rounded-lg shadow-md border border-gray-300" />
            <button
              onClick={removeImage}
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Remove Image
            </button>
          </div>
        )}

        <div className="mt-6 h-[45%] overflow-y-scroll">
          {matchedUsers.length > 0 ? (
            matchedUsers.map((user) => (
              <div key={user._id} className="flex items-center gap-4 bg-white shadow-md rounded-lg p-4 mb-3">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">{user.username}</h2>
                  <p className="text-sm text-gray-500">{user.fullname}</p>
                </div>
                <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-green-100 text-green-600">{user.matchType}</span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-4">No matching users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
