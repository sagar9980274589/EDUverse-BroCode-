import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

const VideoModal = ({ video, onClose }) => {
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
