import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack, Settings, ExternalLink } from 'lucide-react';

const VideoPlayer = ({ video, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  // Determine video type
  const isYoutubeVideo = (video.type === 'video' || video.type === 'playlist') && isYoutubeUrl(video.url);
  const isUploadedVideo = video.type === 'uploaded' || (!isYoutubeVideo && video.url);

  // Check if URL is a YouTube URL
  function isYoutubeUrl(url) {
    if (!url) return false;
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  }

  // Format YouTube URL for embedding
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;

    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&enablejsapi=1`;
    }

    return null;
  };

  // Format time (seconds) to MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle seeking
  const handleSeek = (e) => {
    if (videoRef.current) {
      const seekTime = (e.target.value / 100) * duration;
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
      } else {
        videoRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Skip forward/backward
  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  // Show/hide controls on mouse movement
  const handleMouseMove = () => {
    setShowControls(true);

    // Clear existing timeout
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    // Set new timeout to hide controls after 3 seconds
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Update time display
  useEffect(() => {
    if (!isUploadedVideo) return;

    const handleTimeUpdate = () => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
        setLoading(false);
      }
    };

    const handleVideoEnd = () => {
      setIsPlaying(false);
    };

    const handleError = (e) => {
      console.error("Video error:", e);
      setLoading(false);
    };

    const video = videoRef.current;

    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('ended', handleVideoEnd);
      video.addEventListener('error', handleError);

      // Try to load the video
      video.load();

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('ended', handleVideoEnd);
        video.removeEventListener('error', handleError);
      };
    }
  }, [isUploadedVideo, video.url]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {isYoutubeVideo ? (
        // YouTube Video
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={getYoutubeEmbedUrl(video.url)}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            onLoad={() => setLoading(false)}
          ></iframe>

          {/* YouTube videos use their own controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent flex justify-between items-center text-white">
            <div>
              <h3 className="font-medium">{video.title}</h3>
            </div>
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white hover:text-indigo-300 flex items-center"
            >
              <ExternalLink size={14} className="mr-1" />
              Open on YouTube
            </a>
          </div>
        </div>
      ) : (
        // Uploaded Video
        <>
          <video
            ref={videoRef}
            src={video.url}
            className="w-full h-full"
            onClick={togglePlay}
            preload="metadata"
            controls={false}
            autoPlay={false}
          />

          {/* Custom controls for uploaded videos */}
          {showControls && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex justify-between items-center text-white mb-2">
                <div>
                  <h3 className="font-medium">{video.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => skip(-10)} className="p-1 hover:bg-white/20 rounded-full">
                    <SkipBack size={16} />
                  </button>
                  <button onClick={togglePlay} className="p-2 hover:bg-white/20 rounded-full">
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button onClick={() => skip(10)} className="p-1 hover:bg-white/20 rounded-full">
                    <SkipForward size={16} />
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={toggleMute} className="p-1 hover:bg-white/20 rounded-full">
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 accent-white"
                  />
                  <button onClick={toggleFullscreen} className="p-1 hover:bg-white/20 rounded-full">
                    <Maximize size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-white">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(currentTime / duration) * 100 || 0}
                  onChange={handleSeek}
                  className="flex-grow h-1 accent-white"
                />
                <span className="text-xs text-white">{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}

          {/* Play button overlay when paused */}
          {!isPlaying && !loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30" onClick={togglePlay}>
              <div className="bg-white/20 rounded-full p-4">
                <Play size={32} className="text-white" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
