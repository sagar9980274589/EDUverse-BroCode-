import User from "../model/user.model.js";
import Post from "../model/post.model.js";
import Comment from "../model/comment.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import { uploadToCloudinary } from "../service/multer.js";
import { getsocketid, io } from "../index.js";


import { validationResult } from "express-validator";

export const register = async (req, res) => {
  try {
    const {
      fullname,
      email,
      password,
      username,
      facialEmbeddings,
      // Educational platform fields
      userType,
      // Mentor-specific fields
      expertise,
      experience,
      qualifications,
      hourlyRate,
      // Student-specific fields
      interests,
      educationLevel,
      bio
    } = req.body;

    // ✅ Validate request body
    if (!fullname || !email || !password || !username || !facialEmbeddings) {
      return res.status(400).json({
        success: false,
        message: "All fields are required, including facial embeddings.",
      });
    }

    // ✅ Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please log in.",
      });
    }

    // ✅ Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user object with common fields
    const userData = {
      fullname,
      email,
      password: hashedPassword,
      username,
      facialEmbeddings,
      bio: bio || ""
    };

    // ✅ Add educational platform fields if provided
    if (userType) {
      userData.userType = userType;

      // Add user type specific fields
      if (userType === "mentor") {
        if (expertise) userData.expertise = Array.isArray(expertise) ? expertise : [expertise];
        if (experience) userData.experience = experience;
        if (qualifications) userData.qualifications = qualifications;
        if (hourlyRate) userData.hourlyRate = hourlyRate;
      } else if (userType === "student") {
        if (interests) userData.interests = Array.isArray(interests) ? interests : [interests];
        if (educationLevel) userData.educationLevel = educationLevel;
      }
    }

    // ✅ Create new user in the database
    const newUser = await User.create(userData);

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      userId: newUser._id, // Return the user ID if needed
    });
  } catch (err) {
    console.error("❌ Error registering user:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: err.message, // Avoid exposing sensitive errors
    });
  }
};




export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(500).json({
        success: false,
        message: "all fields are required",
      });
    }
    const user = await User.find({ email: email });

    if (user.length == 0) {
      return res.status(401).json({
        success: false,
        message: "email or password wrong",
      });
    }
    try {
      const matchpass = await bcrypt.compare(password, user[0].password);
      if (matchpass) {
        const token = jwt.sign(
          { id: user[0]._id, email: user[0].email },
          process.env.JWT_SECRET
        );

        // Get user data without password
        const userData = await User.findById(user[0]._id).select("-password");

        return res.cookie("token", token).status(200).json({
          success: true,
          message: "user logged in succesfully",
          token: token,
          user: userData
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "email or password wrong",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "An error occurred during login",
        error: err.message
      });
    }
  } catch (err) {
    console.log("error logging in user :", err);
    return res.status(400).json({
      success: false,
      message: `something went wrong : ${err}`,
    });
  }
};

export const editprofile = async (req, res) => {
  try {
    const userid = req.id;

    if (!userid) {
      return res.status(401).json({
        success: false,
        message: "user not authenticated",
      });
    }
    const user = await User.findOne({ _id: userid }).select("-password");
    if(user){
    const { bio, gender } = req.body;

    const url = await uploadToCloudinary(req.file.path);

    const data = await User.findOneAndUpdate(
      { _id: userid },
      { bio: bio, gender: gender, profile: url }
    );

    res.status(200).json({ success: true, message: "edited succesfully" });
}else{
    return res.status(401).json({
        success: false,
        message: "user not authenticated",
      });
  }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating profile",
    });
  }
};

// Update student profile for educational platform
export const updateProfile = async (req, res) => {
  try {
    const userid = req.id;

    if (!userid) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await User.findOne({ _id: userid }).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Extract data from request
    const { bio, interests, educationLevel } = req.body;

    // Prepare update object
    const updateData = {};

    if (bio !== undefined) {
      updateData.bio = bio;
    }

    if (interests) {
      try {
        // Parse interests if it's a JSON string
        updateData.interests = typeof interests === 'string' ? JSON.parse(interests) : interests;
      } catch (error) {
        console.error("Error parsing interests:", error);
      }
    }

    if (educationLevel) {
      updateData.educationLevel = educationLevel;
    }

    // Handle profile image if provided
    if (req.file) {
      const url = await uploadToCloudinary(req.file.path);
      updateData.profile = url;
    }

    // Update user data
    const updatedUser = await User.findOneAndUpdate(
      { _id: userid },
      updateData,
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating profile",
      error: err.message
    });
  }
};

export const getprofile = async (req, res) => {
  try {
    const userid = req.id;

    if (!userid) {
      return res.status(401).json({
        success: false,
        message: "user not authenticated",
      });
    }

    const user = await User.findOne({ _id: userid }).select("-password");
    if(user){
    res.status(200).json({
      success: true,
      user: user,
    });
}
else{
    return res.status(401).json({
        success: false,
        message: "user not authenticated",
      });
  }
  } catch (err) {
    console.log(err);
  }
};

////
export const getothersprofile = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(401).json({
        success: false,
        message: "user not authenticated",
      });
    }

    const user = await User.findOne({ _id: username }).select("-password");
    if(user){
    res.status(200).json({
      success: true,
      user: user,
    });
}
else{
    return res.status(401).json({
        success: false,
        message: "user not authenticated",
      });
  }
  } catch (err) {
    console.log(err);
  }
};
///

export const uploadpost = async (req, res) => {
  try {
    const userid = req.id;
    const { caption } = req.body;
    if (!caption) {
      caption = "";
    }
    if (!req.file) {
      return res.status(500).json({ message: "image is compulsary" });
    }

    if (!userid) {
      return res.status(401).json({
        success: false,
        message: "user not authenticated",
      });
    }

    const user = await User.findOne({ _id: userid });

    if (user) {

      const url = await uploadToCloudinary(req.file.path);
    const postdata=  await Post.insertOne({
        caption: caption,
        image: url,
        author: user._id,
      });
      await User.findOneAndUpdate(
        { _id: user._id },
        { $push: { posts: postdata._id } }
      );

      res.status(200).json({success:true, message: "post uploaded succesfully",post:postdata });
    }
    else{
        return res.status(401).json({
            success: false,
            message: "user not authenticated",
          });
      }
  } catch (err) {
    console.log(err);
  }
};

/////

export const comment = async (req, res) => {
  try {
    const userid = req.id;
    const { comment } = req.body;
    const { post } = req.params;

    if (!comment || !post) {
      return res
        .status(500)
        .json({ message: "comment is compulsary or post error" });
    }

    if (!userid) {
      return res.status(401).json({
        success: false,
        message: "user not authenticated",
      });
    }

    const user = await User.findOne({ _id: userid });

    if (user) {
      // Create a new comment using the Mongoose model
      const newComment = new Comment({
        author: user._id,
        comment: comment,
        post: post
      });

      // Save the comment
      const savedComment = await newComment.save();

      // Update the post's comments array
      await Post.findByIdAndUpdate(
        post,
        { $push: { comments: savedComment._id } }
      );

      res.status(200).json({ message: "comment added succesfully" });
    }
    else{
        return res.status(401).json({
            success: false,
            message: "user not authenticated",
          });
      }
  } catch (err) {
    console.log(err);
  }
};
///

export const likeorunlike = async (req, res) => {
    try {
      const userid = req.id;

      const { post } = req.params;
      if ( !post) {
        return res
          .status(500)
          .json({  success: false, message: " post error" });
      }

      if (!userid) {
        return res.status(401).json({
          success: false,
          message: "user not authenticated",
        });
      }

      const user = await User.findOne({ _id: userid }).select('username profile');


      if (user) {
        const postdata= await Post.findOne({_id:post})
        const postownerid=postdata.author._id;



        if( postdata.likes.includes(userid))
        {
          await Post.findOneAndUpdate(
            { _id: post },
            { $pull: { likes: user._id } }
          );
          if(postownerid!==userid){
            const notification={
              type:"dislike",
              userid,
              userdetails:user,
              post,
              message:"your post was liked"

            }
          const postownersocketid=getsocketid(postownerid);
          io.to(postownersocketid).emit('notification',notification);
          }
          res.status(200).json({  success: true, message: "disliked" });
        }
        else{

          await Post.findOneAndUpdate(
            { _id: post },
            { $push: { likes: user._id } }
          );
          if(postownerid!==userid){
            const notification={
              type:"like",
              userid,
              userdetails:user,
              post,
              message:"your post was liked"

            }
          const postownersocketid=getsocketid(postownerid);
          io.to(postownersocketid).emit('notification',notification);
          }

          res.status(200).json({  success: true, message: "liked" });
        }



      }
      else{
        return res.status(401).json({
            success: false,
            message: "user not authenticated",
          });
      }
    } catch (err) {
      console.log(err);
    }
  };
  ///

export const followorunfollow = async (req, res) => {
    try {
      const userid = req.id;
      const {targetid} = req.params;

      if (!targetid) {
        return res
          .status(500)
          .json({ success: false, message: "Target ID is required" });
      }

      if (!userid) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      if (userid == targetid) {
        return res.status(500).json({
          success: false,
          message: "You can't follow or unfollow yourself",
        });
      }

      const user = await User.findOne({ _id: userid });
      const targetUser = await User.findOne({ _id: targetid });

      if (!user || !targetUser) {
        return res.status(401).json({
          success: false,
          message: "User or target user not found",
        });
      }

      // If already following, unfollow
      if (user.following.includes(targetUser._id)) {
        await User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { following: targetUser._id } }
        );

        await User.findOneAndUpdate(
          { _id: targetUser._id },
          { $pull: { followers: user._id } }
        );

        return res.status(200).json({
          success: true,
          message: "Unfollowed successfully"
        });
      }
      // If not following, directly follow the user
      else {
        // Add to following and followers
        await User.findOneAndUpdate(
          { _id: user._id },
          { $push: { following: targetUser._id } }
        );

        await User.findOneAndUpdate(
          { _id: targetUser._id },
          { $push: { followers: user._id } }
        );

        return res.status(200).json({
          success: true,
          message: "Followed successfully"
        });
      }
    } catch (err) {
      console.error("Error in followorunfollow:", err);
      return res.status(500).json({
        success: false,
        message: "An error occurred",
        error: err.message
      });
    }
  };
  //////

  export const getpostcontent = async (req, res) => {
    try {

      const userid = req.id;

      if (!userid) {
        return res.status(401).json({
          success: false,
          message: "user id not found",
        });
      }

      const post = await Post.find({ author: userid });

      if(post){
      res.status(200).json({
        success: true,
        post: post,
      });
  }
  else{
      return res.status(401).json({
          success: false,
          message: "post not found",
        });
    }
    } catch (err) {
      console.log(err);
    }
  };


  export const getcomments = async (req, res) => {
    try {
      const { postid } = req.params;

      if (!postid) {
        return res.status(401).json({
          success: false,
          message: "post id not found",
        });
      }

      const comments = await Comment.find({ post: postid }).populate('author','profile username');

      if(comments){
      res.status(200).json({
        success: true,
        comments: comments,
      });
  }
  else{
      return res.status(401).json({
          success: false,
          message: "comments not found",
        });
    }
    } catch (err) {
      console.log(err);
    }
  };
  //
  export const deletecomment = async (req, res) => {
    try {
      const { commentid } = req.params;

      if (!commentid) {
        return res.status(401).json({
          success: false,
          message: "comment id not found",
        });
      }

      const comment = await Comment.findOne({ _id: commentid });

      if(comment){
        await Comment.deleteOne({ _id: commentid });
        await Post.updateOne({$pull:{comments:commentid}})
        res.status(200).json({
          success: true,
          message:"comment deleted"
        })
  }
  else{
      return res.status(401).json({
          success: false,
          message: "comments not found",
        });
    }
    } catch (err) {
      console.log(err);
    }
  };

///
export const deletepost = async (req, res) => {
  try {
    const { postid } = req.params;

    if (!postid) {
      return res.status(401).json({
        success: false,
        message: "post id not found",
      });
    }

    const post = await Post.findOne({ _id: postid });

    if(post){
      await Post.deleteOne({ _id: postid });
      await User.updateOne({ _id: post.author }, { $pull: { posts: postid } });
      await Comment.deleteMany({post:postid})
      res.status(200).json({
        success: true,
        message:"post deleted"
      })
}
else{
    return res.status(401).json({
        success: false,
        message: "post not found",
      });
  }
  } catch (err) {
    console.log(err);
  }
};

export const getallpost = async(req,res)=>{
  try{
    const Posts = await Post.find()
  .sort({ createdAt: -1 }) // Sorts newest first
  .populate('author', 'username profile') // Populate author details
  .populate({
    path: 'comments',
    populate: { path: 'author', select: 'username profile' }, // Populate author inside comments
  });


res.status(200).json({
  success: true,
  posts:Posts});

  }
  catch(err){
    console.log(err)
  }
}
//
export const getsuggested = async(req, res) => {
  try {
    const userid = req.id;
    if (!userid) {
      return res.status(401).json({
        success: false,
        message: "user not authenticated",
      });
    }

    // Use _id instead of id to correctly filter out the current user
    const suggested = await User.find({ _id: { $ne: userid } })
      .select('_id username fullname profile userType')
      .limit(10);

    return res.status(200).json({
      success: true,
      suggested
    });
  }
  catch(err) {
    console.error("Error fetching suggested users:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching suggested users"
    });
  }
}
//

export const bookmark=async(req,res)=>{



  try{

    const userid = req.id;
    if (!userid) {
      return res.status(401).json({
        success: false,
        message: "user not authenticated",
      });
    }

      const { postid } = req.params;

      if (!postid) {
        return res.status(401).json({
          success: false,
          message: "post id not found",
        });
      }

      const user = await User.findOne({ _id:  userid } );

if(user){
if(user.bookmarks.includes(postid))
{
  await User.updateOne({_id:userid},{$pull:{bookmarks:postid}})
  res.status(200).json({ success: true,message:"bookmark removed "})
}else{


await User.updateOne({_id:userid},{$push:{bookmarks:postid}})
res.status(200).json({ success: true,message:"bookmark added "})
}
}
else{
  return res.status(401).json({
      success: false,
      message: "user not found",
    });

  }
}
  catch(err){
console.log(err)
  }

}


export const getbookmark = async (req, res) => {
  try {
    const userId = req.id;  // Get the user ID from the request (assumed to be attached)

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found",
      });
    }

    // Find the user by ID and populate the bookmarks field with actual Post documents
    const user = await User.findById(userId)
                            .populate({
                              path: "bookmarks",   // Populate the bookmarks field
                              select: "image caption likes comments author", // Select fields from the Post model you need
                              populate: {
                                path: "author",   // Optional: populate the 'author' field to get user details
                                select: "username profile"  // Select fields from the User model
                              }
                            });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return the list of bookmarked posts with full details
    return res.status(200).json({
      success: true,
      bookmarkedPosts: user.bookmarks,  // Send the bookmarked posts with full details
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching bookmarked posts.",
    });
  }
};

// Get user by ID
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all mentors with optional filtering
export const getMentors = async (req, res) => {
  try {
    const { expertise, experience, search } = req.query;

    // Build filter object
    const filter = { userType: "mentor" };

    if (expertise) {
      filter.expertise = { $in: [expertise] };
    }

    if (experience) {
      filter.experience = { $gte: parseInt(experience) };
    }

    if (search) {
      filter.$or = [
        { fullname: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { expertise: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const mentors = await User.find(filter)
      .select('fullname username profile bio expertise experience courses createdAt')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      mentors
    });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching mentors",
      error: error.message
    });
  }
};

// Connect GitHub account and fetch repositories
export const connectGitHub = async (req, res) => {
  try {
    const userId = req.id;
    const { githubUsername } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!githubUsername) {
      return res.status(400).json({
        success: false,
        message: "GitHub username is required",
      });
    }

    try {
      // First fetch user profile data from GitHub API
      const userResponse = await axios.get(`https://api.github.com/users/${githubUsername}`);

      if (userResponse.status !== 200) {
        return res.status(404).json({
          success: false,
          message: "GitHub username not found or API rate limit exceeded",
        });
      }

      // Extract relevant user data
      const githubData = {
        login: userResponse.data.login,
        id: userResponse.data.id,
        avatar_url: userResponse.data.avatar_url,
        html_url: userResponse.data.html_url,
        name: userResponse.data.name,
        bio: userResponse.data.bio,
        public_repos: userResponse.data.public_repos,
        followers: userResponse.data.followers,
        following: userResponse.data.following,
        created_at: userResponse.data.created_at,
        updated_at: userResponse.data.updated_at
      };

      // Fetch user repositories from GitHub API
      const reposResponse = await axios.get(`https://api.github.com/users/${githubUsername}/repos`);

      if (reposResponse.status !== 200) {
        return res.status(404).json({
          success: false,
          message: "Failed to fetch GitHub repositories",
        });
      }

      // Extract relevant repository data
      const repos = reposResponse.data.map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        updated_at: repo.updated_at,
        created_at: repo.created_at,
        topics: repo.topics || [],
        visibility: repo.visibility,
        default_branch: repo.default_branch,
        size: repo.size,
        watchers_count: repo.watchers_count,
        fork: repo.fork,
        homepage: repo.homepage
      }));

      // Update user with GitHub data and initialize streak data
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          githubUsername,
          githubRepos: repos,
          githubData,
          githubLastUpdated: new Date(),
          githubConnected: true,
          // Initialize streak data
          projectStreak: 1,
          projectStreakLastUpdated: today,
          longestProjectStreak: 1,
          totalProjectContributions: 0,
          projectContributionHistory: { [today.toISOString().split('T')[0]]: 1 }
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "GitHub account connected successfully",
        githubUsername,
        githubData,
        repos
      });
    } catch (error) {
      console.error("GitHub API error:", error.response?.data || error.message);
      return res.status(404).json({
        success: false,
        message: "GitHub username not found or API rate limit exceeded",
        error: error.response?.data?.message || error.message
      });
    }
  } catch (error) {
    console.error("Error connecting GitHub account:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while connecting GitHub account",
      error: error.message
    });
  }
};

// Disconnect GitHub account
export const disconnectGitHub = async (req, res) => {
  try {
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.githubUsername) {
      return res.status(400).json({
        success: false,
        message: "GitHub account not connected",
      });
    }

    // Update user to remove GitHub data
    await User.findByIdAndUpdate(
      userId,
      {
        githubUsername: "",
        githubRepos: [],
        githubData: null,
        githubLastUpdated: null,
        githubConnected: false
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "GitHub account disconnected successfully"
    });
  } catch (error) {
    console.error("Error disconnecting GitHub account:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while disconnecting GitHub account",
      error: error.message
    });
  }
};

// Get GitHub repositories for a user
export const getGitHubRepos = async (req, res) => {
  try {
    const userId = req.params.userId || req.id;
    const forceRefresh = req.query.refresh === 'true';

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.githubUsername) {
      return res.status(404).json({
        success: false,
        message: "GitHub account not connected",
      });
    }

    // Check if we need to refresh the data
    const shouldRefresh = forceRefresh ||
                         !user.githubLastUpdated ||
                         (new Date() - new Date(user.githubLastUpdated)) > (24 * 60 * 60 * 1000); // 24 hours

    // If we have cached repos and they're not too old, return them
    if (user.githubRepos && user.githubRepos.length > 0 && !shouldRefresh) {
      return res.status(200).json({
        success: true,
        githubUsername: user.githubUsername,
        githubData: user.githubData,
        repos: user.githubRepos,
        lastUpdated: user.githubLastUpdated,
        fromCache: true
      });
    } else {
      // Otherwise fetch fresh data from GitHub
      try {
        // First fetch user profile data
        const userResponse = await axios.get(`https://api.github.com/users/${user.githubUsername}`);

        if (userResponse.status !== 200) {
          return res.status(404).json({
            success: false,
            message: "GitHub username not found or API rate limit exceeded",
          });
        }

        // Extract relevant user data
        const githubData = {
          login: userResponse.data.login,
          id: userResponse.data.id,
          avatar_url: userResponse.data.avatar_url,
          html_url: userResponse.data.html_url,
          name: userResponse.data.name,
          bio: userResponse.data.bio,
          public_repos: userResponse.data.public_repos,
          followers: userResponse.data.followers,
          following: userResponse.data.following,
          created_at: userResponse.data.created_at,
          updated_at: userResponse.data.updated_at
        };

        // Then fetch repositories
        const reposResponse = await axios.get(`https://api.github.com/users/${user.githubUsername}/repos`);

        if (reposResponse.status !== 200) {
          return res.status(404).json({
            success: false,
            message: "Failed to fetch GitHub repositories",
          });
        }

        // Extract relevant repository data
        const repos = reposResponse.data.map(repo => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          html_url: repo.html_url,
          language: repo.language,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          updated_at: repo.updated_at,
          created_at: repo.created_at,
          topics: repo.topics || [],
          visibility: repo.visibility,
          default_branch: repo.default_branch,
          size: repo.size,
          watchers_count: repo.watchers_count,
          fork: repo.fork,
          homepage: repo.homepage
        }));

        // Update user with repositories and GitHub data
        await User.findByIdAndUpdate(
          userId,
          {
            githubRepos: repos,
            githubData,
            githubLastUpdated: new Date(),
            githubConnected: true
          },
          { new: true }
        );

        return res.status(200).json({
          success: true,
          githubUsername: user.githubUsername,
          githubData,
          repos,
          lastUpdated: new Date(),
          fromCache: false
        });
      } catch (error) {
        console.error("GitHub API error:", error.response?.data || error.message);

        // If we have cached data, return it with a warning
        if (user.githubRepos && user.githubRepos.length > 0) {
          return res.status(200).json({
            success: true,
            githubUsername: user.githubUsername,
            githubData: user.githubData,
            repos: user.githubRepos,
            lastUpdated: user.githubLastUpdated,
            fromCache: true,
            warning: "Using cached data. Failed to refresh from GitHub API."
          });
        }

        return res.status(404).json({
          success: false,
          message: "GitHub username not found or API rate limit exceeded",
          error: error.response?.data?.message || error.message
        });
      }
    }
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching GitHub repositories",
      error: error.message
    });
  }
};
