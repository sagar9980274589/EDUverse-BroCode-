import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { X } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import axios from 'axios';

const VideoModal = ({ video, onClose, courseId }) => {
  const user = useSelector((state) => state.data.userdata);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Record video watch activity when modal opens
  useEffect(() => {
    const recordVideoWatch = async () => {
      if (user && user._id && video) {
        try {
          await axios.post(
            'http://localhost:3000/learning/record-activity',
            {
              activityType: 'video_watch',
              courseId: video.courseId || null,
              contentId: video.id || null,
              contentTitle: video.title || 'Untitled Video',
              activityData: {
                videoType: video.type || 'video',
                videoUrl: video.url || ''
              },
              activityDuration: 0, // Initial duration, will be updated on close
              activityPoints: 2 // Videos are worth more points
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
        } catch (error) {
          console.error("Error recording video watch activity:", error);
          // Don't show error to user as this is a background operation
        }
      }
    };

    recordVideoWatch();
  }, [user, video]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="relative w-full max-w-5xl">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 focus:outline-none"
        >
          <X size={24} />
          <span className="sr-only">Close</span>
        </button>

        <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
          <VideoPlayer video={video} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
