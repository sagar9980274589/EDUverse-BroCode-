import { useEffect, useState, useCallback } from 'react';
import api from '../AxiosInstance'; 

const useGetmyprofile = () => {
  const [profile, setProfile] = useState({});
  const [post, setPost] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]); // State for bookmarked posts
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch profile and posts
  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/user/getprofile");
      if (res.data.success) {
        setProfile(res.data.user);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("An error occurred while fetching the profile.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/user/getpost");
      if (res.data.success) {
        setPost(res.data.post);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("An error occurred while fetching posts.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to fetch bookmarked posts
  const fetchBookmarkedPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/user/getbookmarks");
      if (res.data.success) {
        setBookmarkedPosts(res.data.bookmarkedPosts);
        console.log(res.data)
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("An error occurred while fetching bookmarked posts.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload profile, posts, and bookmarked posts data
  const reloadProfile = useCallback(() => {
    fetchProfileData();
    fetchPosts();
    fetchBookmarkedPosts(); // Adding fetching of bookmarked posts
  }, [fetchProfileData, fetchPosts, fetchBookmarkedPosts]);

  // Initial fetch
  useEffect(() => {
    fetchProfileData();
    fetchPosts();
    fetchBookmarkedPosts(); // Fetch bookmarks on initial load
  }, [fetchProfileData, fetchPosts, fetchBookmarkedPosts]);

  return { profile, post, bookmarkedPosts, loading, error, reloadProfile };
};

export default useGetmyprofile;
