import React, { useState, useEffect } from "react";
import api from "../../../AxiosInstance";
import * as faceapi from "face-api.js";
import { Search, Upload, X, User, Users } from "lucide-react";
import { toast } from "react-toastify";

const AdvancedSearch = ({ onUserSelect }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [image, setImage] = useState(null);
  const [faceEmbeddings, setFaceEmbeddings] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Load face-api.js models on component mount
  useEffect(() => {
    async function loadModels() {
      try {
        setIsSearching(true);
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        console.log("✅ Face-api.js models loaded!");
        setModelsLoaded(true);
      } catch (error) {
        console.error("❌ Error loading models:", error);
        toast.error("Failed to load facial recognition models");
      } finally {
        setIsSearching(false);
      }
    }

    loadModels();
  }, []);

  // Initial fetch of suggested users
  useEffect(() => {
    async function getSuggestedUsers() {
      try {
        const res = await api.get("/user/getsuggested");
        if (res.data.success) {
          setAllUsers(res.data.suggested);
          console.log("✅ Suggested Users Fetched:", res.data.suggested);
        } else {
          console.log(res.data.message);
        }
      } catch (err) {
        console.error("Error fetching suggested users:", err);
        toast.error("Failed to fetch suggested users");
      }
    }

    getSuggestedUsers();
  }, []);

  // Handle text search
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (value.trim() === "" && !faceEmbeddings) {
      // If search is empty and no face embeddings, just show suggested users
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    try {
      // Search users with the current query and face embeddings
      const response = await api.post("/search/search", {
        query: value,
        facialEmbeddings: faceEmbeddings
      });

      if (response.data.success) {
        setMatchedUsers(response.data.users);
      } else {
        console.error("Search failed:", response.data.message);
        toast.error("Search failed");
      }
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Error searching users");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle image upload for facial search
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const img = URL.createObjectURL(file);
    setImage(img);
    setIsSearching(true);

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
          setFaceEmbeddings(embeddings);

          // Search with the current text and new face embeddings
          try {
            const response = await api.post("/search/search", {
              query: searchText,
              facialEmbeddings: embeddings
            });

            if (response.data.success) {
              setMatchedUsers(response.data.users);
              setShowResults(true);
            } else {
              console.error("Search failed:", response.data.message);
              toast.error("Search failed");
            }
          } catch (error) {
            console.error("Error searching users:", error);
            toast.error("Error searching users");
          }
        } else {
          console.warn("⚠️ No clear face detected. Please upload a clearer image.");
          toast.warning("No clear face detected. Please upload a clearer image.");
          setFaceEmbeddings(null);
        }
        setIsSearching(false);
      };
    } catch (error) {
      console.error("❌ Error processing image:", error);
      toast.error("Error processing image");
      setIsSearching(false);
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    setImage(null);
    setFaceEmbeddings(null);
    document.getElementById("face-search-upload").value = "";

    // If there's text search, perform search without face embeddings
    if (searchText.trim() !== "") {
      handleSearch({ target: { value: searchText } });
    } else {
      setShowResults(false);
    }
  };

  // Handle user selection
  const handleUserSelect = (user) => {
    console.log("User selected:", user);
    if (onUserSelect) {
      onUserSelect(user);
    }
    // Clear search text and close results
    setSearchText("");
    setShowResults(false);

    // Show feedback to the user
    toast.success(`Selected user: ${user.username}`);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchText}
            onChange={handleSearch}
            placeholder="Search by name or upload a photo..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="face-search-upload"
            onChange={handleImageUpload}
          />
          <label
            htmlFor="face-search-upload"
            className={`cursor-pointer p-2 rounded-lg ${modelsLoaded ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            title={modelsLoaded ? "Upload a photo to search by face" : "Face recognition models loading..."}
          >
            <Upload size={20} />
          </label>
        </div>
      </div>

      {/* Image preview */}
      {image && (
        <div className="mt-2 flex items-center">
          <div className="relative">
            <img src={image} alt="Search" className="w-12 h-12 object-cover rounded-full border border-gray-300" />
            <button
              onClick={removeImage}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
              title="Remove image"
            >
              <X size={14} />
            </button>
          </div>
          <span className="ml-2 text-sm text-gray-600">Searching by face...</span>
        </div>
      )}

      {/* Loading indicator */}
      {isSearching && (
        <div className="mt-2 flex items-center">
          <div className="animate-spin w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Searching...</span>
        </div>
      )}

      {/* Search results */}
      {showResults && matchedUsers.length > 0 && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black bg-opacity-30" onClick={() => setShowResults(false)}>
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-200 max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800">Search Results</h3>
                <button
                  onClick={() => setShowResults(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[60vh] p-2">
              {matchedUsers.map((user) => (
                <button
                  key={user._id}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md cursor-pointer text-left transition-colors mb-1 border border-transparent hover:border-gray-200"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="flex-shrink-0">
                    {user.profile ? (
                      <img
                        src={user.profile}
                        alt={user.username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User size={24} className="text-indigo-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-gray-800 truncate">{user.username}</p>
                    <p className="text-sm text-gray-500 truncate">{user.fullname}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      user.matchType === "Text & Face Match"
                        ? "bg-green-100 text-green-800"
                        : user.matchType === "Face Match"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}>
                      {user.matchType}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowResults(false)}
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No results message */}
      {showResults && searchText && matchedUsers.length === 0 && !isSearching && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black bg-opacity-30" onClick={() => setShowResults(false)}>
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800">Search Results</h3>
                <button
                  onClick={() => setShowResults(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No users found</h3>
              <p className="text-gray-600 mb-6">We couldn't find any users matching your search criteria.</p>
              <button
                onClick={() => setShowResults(false)}
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
