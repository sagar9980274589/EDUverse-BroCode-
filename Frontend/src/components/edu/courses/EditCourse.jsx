import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Navbar from "../layout/Navbar";
import {
  BookOpen,
  Video,
  FileText,
  Plus,
  Trash2,
  Save,
  Link as LinkIcon,
  Youtube,
  List,
  Upload,
  AlertCircle
} from "lucide-react";

const EditCourse = () => {
  // Always set isEditing to true since this is the EditCourse component
  const isEditing = true;
  const user = useSelector((state) => state.data.userdata);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [courseImage, setCourseImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [existingMaterials, setExistingMaterials] = useState([]);
  const [isPublished, setIsPublished] = useState(false);

  // Debug: Log params
  useEffect(() => {
    console.log("EditCourse component mounted with courseId:", courseId);
  }, [courseId]);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    price: 0,
    isFree: true,
    videoLinks: [{ title: "", url: "", type: "video" }],
    sections: [{
      title: "Introduction",
      content: [
        { title: "", type: "video", url: "" }
      ]
    }]
  });

  // Fetch course data for editing
  const fetchCourseData = useCallback(async () => {
    try {
      console.log("Fetching course data for courseId:", courseId);
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/course/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("API response:", response.data);

      if (response.data.success) {
        const course = response.data.course;

        // Check if the user is the mentor of this course
        if (course.mentor._id !== user._id) {
          toast.error("You are not authorized to edit this course");
          navigate("/my-courses");
          return;
        }

        // Set form data from course
        setFormData({
          title: course.title || "",
          description: course.description || "",
          category: course.category || "",
          level: course.level || "beginner",
          price: course.price || 0,
          isFree: course.isFree || false,
          videoLinks: course.videoLinks.length > 0 ? course.videoLinks : [{ title: "", url: "", type: "video" }],
          sections: course.sections.length > 0 ? course.sections : [{
            title: "Introduction",
            content: [
              { title: "", type: "video", url: "" }
            ]
          }]
        });

        // Set preview image if exists
        if (course.image) {
          setPreviewImage(course.image);
        }

        // Set existing materials
        if (course.materials && course.materials.length > 0) {
          setExistingMaterials(course.materials);
        }

        // Set publish status
        setIsPublished(course.isPublished || false);
      } else {
        toast.error("Failed to fetch course data");
        navigate("/my-courses");
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error(error.response?.data?.message || "An error occurred while fetching the course");
      navigate("/my-courses");
    } finally {
      setLoading(false);
    }
  }, [courseId, user, navigate]);

  // Check if user is a mentor and fetch course data
  useEffect(() => {
    console.log("useEffect triggered with courseId:", courseId);

    if (user && user._id) {
      if (user.userType !== "mentor") {
        toast.error("Only mentors can edit courses");
        navigate("/");
        return;
      }

      // Fetch the course data if we have a courseId
      if (courseId) {
        console.log("Fetching course data");
        fetchCourseData();
      } else {
        toast.error("No course ID provided");
        navigate("/my-courses");
      }
    } else {
      navigate("/login");
    }
  }, [user, navigate, courseId, fetchCourseData]);

  // Handle input changes for basic course info
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked
      });

      // If making the course free, reset price to 0
      if (name === "isFree" && checked) {
        setFormData({
          ...formData,
          [name]: checked,
          price: 0
        });
      }
    } else if (name === "price") {
      // Only allow positive numbers for price
      const price = parseFloat(value) >= 0 ? parseFloat(value) : 0;
      setFormData({
        ...formData,
        [name]: price
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle course image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle file upload for course materials
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    // Create preview for each file
    const newFiles = files.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  // Remove uploaded file
  const removeFile = (index) => {
    const newFiles = [...uploadedFiles];

    // Revoke object URL to prevent memory leaks
    if (newFiles[index].preview) {
      URL.revokeObjectURL(newFiles[index].preview);
    }

    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  // Handle video link changes
  const handleVideoLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.videoLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };

    setFormData({
      ...formData,
      videoLinks: updatedLinks
    });
  };

  // Add new video link field
  const addVideoLink = () => {
    setFormData({
      ...formData,
      videoLinks: [...formData.videoLinks, { title: "", url: "", type: "video" }]
    });
  };

  // Remove video link field
  const removeVideoLink = (index) => {
    const updatedLinks = [...formData.videoLinks];
    updatedLinks.splice(index, 1);

    setFormData({
      ...formData,
      videoLinks: updatedLinks
    });
  };

  // Handle section changes
  const handleSectionChange = (sectionIndex, field, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      [field]: value
    };

    setFormData({
      ...formData,
      sections: updatedSections
    });
  };

  // Add new section
  const addSection = () => {
    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        {
          title: `Section ${formData.sections.length + 1}`,
          content: [{ title: "", type: "video", url: "" }]
        }
      ]
    });
  };

  // Remove section
  const removeSection = (index) => {
    if (formData.sections.length <= 1) {
      toast.warning("Course must have at least one section");
      return;
    }

    const updatedSections = [...formData.sections];
    updatedSections.splice(index, 1);

    setFormData({
      ...formData,
      sections: updatedSections
    });
  };

  // Handle section content changes
  const handleContentChange = (sectionIndex, contentIndex, field, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].content[contentIndex] = {
      ...updatedSections[sectionIndex].content[contentIndex],
      [field]: value
    };

    setFormData({
      ...formData,
      sections: updatedSections
    });
  };

  // Add content item to section
  const addContentItem = (sectionIndex, type = "video") => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].content.push({
      title: "",
      type,
      url: ""
    });

    setFormData({
      ...formData,
      sections: updatedSections
    });
  };

  // Remove content item from section
  const removeContentItem = (sectionIndex, contentIndex) => {
    if (formData.sections[sectionIndex].content.length <= 1) {
      toast.warning("Section must have at least one content item");
      return;
    }

    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].content.splice(contentIndex, 1);

    setFormData({
      ...formData,
      sections: updatedSections
    });
  };

  // Validate YouTube URL
  const isValidYoutubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  // Extract YouTube video ID
  const getYoutubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (!formData.title.trim()) {
      toast.error("Course title is required");
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Course description is required");
      setLoading(false);
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      setLoading(false);
      return;
    }

    // Validate video links
    for (const link of formData.videoLinks) {
      if (link.url && !isValidYoutubeUrl(link.url)) {
        toast.error(`Invalid YouTube URL: ${link.url}`);
        setLoading(false);
        return;
      }
    }

    // Validate sections and content
    for (const section of formData.sections) {
      if (!section.title.trim()) {
        toast.error("All sections must have a title");
        setLoading(false);
        return;
      }

      for (const content of section.content) {
        if (!content.title.trim()) {
          toast.error(`All content items in section "${section.title}" must have a title`);
          setLoading(false);
          return;
        }

        if (content.type === "video" && !isValidYoutubeUrl(content.url)) {
          toast.error(`Invalid YouTube URL in section "${section.title}": ${content.url}`);
          setLoading(false);
          return;
        }
      }
    }

    try {
      // Create form data for multipart/form-data (for image and file uploads)
      const data = new FormData();

      // Add course image if selected
      if (courseImage) {
        data.append("courseImage", courseImage);
      }

      // Add course materials
      uploadedFiles.forEach((fileObj, index) => {
        data.append(`materials`, fileObj.file);
        data.append(`materialNames`, fileObj.name);
      });

      // Add existing materials to keep
      if (isEditing && existingMaterials.length > 0) {
        data.append("existingMaterials", JSON.stringify(existingMaterials));
      }

      // Add other form fields
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("level", formData.level);
      data.append("isFree", formData.isFree);
      data.append("price", formData.price);
      data.append("mentorId", user._id);

      // Add publish status if editing
      if (isEditing) {
        data.append("isPublished", isPublished);
      }

      // Add video links and sections as JSON strings
      data.append("videoLinks", JSON.stringify(formData.videoLinks));
      data.append("sections", JSON.stringify(formData.sections));

      // Get token from localStorage
      const token = localStorage.getItem("token");

      let response;

      if (isEditing) {
        // Make API request to update course
        response = await axios.put(
          `http://localhost:3000/course/${courseId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          toast.success("Course updated successfully!");
          navigate(`/course/${courseId}`);
        } else {
          toast.error("Failed to update course. Please try again.");
        }
      } else {
        // Make API request to create course
        response = await axios.post(
          "http://localhost:3000/course/create",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201) {
          toast.success("Course created successfully!");
          navigate(`/course/${response.data.course._id}`);
        } else {
          toast.error("Failed to create course. Please try again.");
        }
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} course:`, error);
      toast.error(error.response?.data?.message || `An error occurred while ${isEditing ? 'updating' : 'creating'} the course`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-28 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
            <div className="flex items-center mb-6">
              <BookOpen className="text-indigo-600 mr-3" size={28} />
              <h1 className="text-2xl font-bold text-gray-800">
                {isEditing ? "Edit Course" : "Create New Course"}
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Course Image */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail</label>
                <div className="flex items-center space-x-6">
                  <div className="w-40 h-24 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Course thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="text-gray-400" size={32} />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                      <span>Upload Image</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      Recommended: 1280×720px (16:9 ratio)
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Course Info */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Course Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Complete Web Development Bootcamp"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Course Description*
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe what students will learn in this course..."
                    required
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category*
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="programming">Programming</option>
                    <option value="design">Design</option>
                    <option value="business">Business</option>
                    <option value="marketing">Marketing</option>
                    <option value="personal">Personal Development</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="all">All Levels</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="isFree"
                      name="isFree"
                      checked={formData.isFree}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isFree" className="ml-2 block text-sm text-gray-700">
                      This is a free course
                    </label>
                  </div>

                  {!formData.isFree && (
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price (USD)
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Course Materials */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  <FileText className="mr-2" size={20} />
                  Course Materials
                </h3>

                <div className="mb-4">
                  <label className="cursor-pointer inline-flex items-center bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                    <Upload className="mr-2" size={16} />
                    <span>Upload Files</span>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      onChange={handleFileUpload}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    Upload PDFs, documents, or other resources for your students
                  </p>
                </div>

                {/* New files to upload */}
                {uploadedFiles.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">New Files to Upload</h4>
                    <ul className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <li key={index} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                          <div className="flex items-center">
                            <FileText className="text-gray-400 mr-2" size={16} />
                            <span className="text-sm">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Existing materials */}
                {isEditing && existingMaterials.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Existing Materials</h4>
                    <ul className="space-y-2">
                      {existingMaterials.map((material, index) => (
                        <li key={index} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                          <div className="flex items-center">
                            <FileText className="text-gray-400 mr-2" size={16} />
                            <span className="text-sm">{material.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <a
                              href={material.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-500 hover:text-indigo-700"
                            >
                              <LinkIcon size={16} />
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedMaterials = [...existingMaterials];
                                updatedMaterials.splice(index, 1);
                                setExistingMaterials(updatedMaterials);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Video Links */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  <Youtube className="mr-2" size={20} />
                  Video Links
                </h3>

                <div className="space-y-4">
                  {formData.videoLinks.map((link, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <input
                            type="text"
                            value={link.title}
                            onChange={(e) => handleVideoLinkChange(index, "title", e.target.value)}
                            placeholder="Video Title"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => handleVideoLinkChange(index, "url", e.target.value)}
                            placeholder="YouTube URL"
                            className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <Youtube className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVideoLink(index)}
                        className="mt-2 text-red-500 hover:text-red-700"
                        disabled={formData.videoLinks.length <= 1}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addVideoLink}
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Video Link
                  </button>
                </div>
              </div>

              {/* Course Sections */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  <List className="mr-2" size={20} />
                  Course Content
                </h3>

                <div className="space-y-6">
                  {formData.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => handleSectionChange(sectionIndex, "title", e.target.value)}
                          placeholder="Section Title"
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeSection(sectionIndex)}
                          className="ml-2 text-red-500 hover:text-red-700"
                          disabled={formData.sections.length <= 1}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                        {section.content.map((content, contentIndex) => (
                          <div key={contentIndex} className="flex items-start space-x-2">
                            <div className="flex-grow grid grid-cols-1 md:grid-cols-5 gap-3">
                              <div className="md:col-span-2">
                                <input
                                  type="text"
                                  value={content.title}
                                  onChange={(e) => handleContentChange(sectionIndex, contentIndex, "title", e.target.value)}
                                  placeholder="Content Title"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                              </div>
                              <div className="md:col-span-2 relative">
                                <input
                                  type="text"
                                  value={content.url}
                                  onChange={(e) => handleContentChange(sectionIndex, contentIndex, "url", e.target.value)}
                                  placeholder="YouTube URL"
                                  className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <Youtube className="absolute left-3 top-2.5 text-gray-400" size={16} />
                              </div>
                              <div>
                                <select
                                  value={content.type}
                                  onChange={(e) => handleContentChange(sectionIndex, contentIndex, "type", e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                  <option value="video">Video</option>
                                  <option value="playlist">Playlist</option>
                                </select>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeContentItem(sectionIndex, contentIndex)}
                              className="mt-2 text-red-500 hover:text-red-700"
                              disabled={section.content.length <= 1}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}

                        <div className="flex space-x-2 mt-2">
                          <button
                            type="button"
                            onClick={() => addContentItem(sectionIndex, "video")}
                            className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                          >
                            <Plus size={14} className="mr-1" />
                            Add Video
                          </button>
                          <button
                            type="button"
                            onClick={() => addContentItem(sectionIndex, "playlist")}
                            className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                          >
                            <Plus size={14} className="mr-1" />
                            Add Playlist
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addSection}
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Section
                  </button>
                </div>
              </div>



              {/* Publish Toggle (only for editing) */}
              {isEditing && (
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
                      Publish this course (make it visible to students)
                    </label>
                  </div>
                  {!isPublished && (
                    <p className="mt-1 text-xs text-gray-500 flex items-center">
                      <AlertCircle size={12} className="mr-1 text-amber-500" />
                      Unpublished courses are only visible to you
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/my-courses")}
                  className="mr-4 px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditing ? "Updating Course..." : "Creating Course..."}
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      {isEditing ? "Update Course" : "Create Course"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
