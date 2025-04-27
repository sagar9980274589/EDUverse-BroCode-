import User from "../model/user.model.js";

// Get follow requests for the authenticated user
export const getFollowRequests = async (req, res) => {
  try {
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get follow requests
    const followRequests = await User.find(
      { _id: { $in: user.followRequests || [] } },
      "username profile userType role"
    );

    return res.status(200).json({
      success: true,
      requests: followRequests,
    });
  } catch (error) {
    console.error("Error getting follow requests:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while getting follow requests",
      error: error.message,
    });
  }
};

// Get users that the authenticated user is following
export const getFollowing = async (req, res) => {
  try {
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get following users
    const following = await User.find(
      { _id: { $in: user.following || [] } },
      "username profile userType role"
    );

    return res.status(200).json({
      success: true,
      following,
    });
  } catch (error) {
    console.error("Error getting following users:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while getting following users",
      error: error.message,
    });
  }
};

// Accept a follow request
export const acceptFollowRequest = async (req, res) => {
  try {
    const userId = req.id;
    const { requestId } = req.params;

    if (!userId || !requestId) {
      return res.status(400).json({
        success: false,
        message: "User ID and request ID are required",
      });
    }

    // Find both users
    const user = await User.findById(userId);
    const requester = await User.findById(requestId);

    if (!user || !requester) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the request exists
    if (!user.followRequests.includes(requestId)) {
      return res.status(400).json({
        success: false,
        message: "Follow request not found",
      });
    }

    // Update both users
    await User.findByIdAndUpdate(userId, {
      $pull: { followRequests: requestId },
      $push: { followers: requestId },
    });

    await User.findByIdAndUpdate(requestId, {
      $push: { following: userId },
    });

    return res.status(200).json({
      success: true,
      message: "Follow request accepted",
    });
  } catch (error) {
    console.error("Error accepting follow request:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while accepting follow request",
      error: error.message,
    });
  }
};

// Reject a follow request
export const rejectFollowRequest = async (req, res) => {
  try {
    const userId = req.id;
    const { requestId } = req.params;

    if (!userId || !requestId) {
      return res.status(400).json({
        success: false,
        message: "User ID and request ID are required",
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the request exists
    if (!user.followRequests.includes(requestId)) {
      return res.status(400).json({
        success: false,
        message: "Follow request not found",
      });
    }

    // Remove the request
    await User.findByIdAndUpdate(userId, {
      $pull: { followRequests: requestId },
    });

    return res.status(200).json({
      success: true,
      message: "Follow request rejected",
    });
  } catch (error) {
    console.error("Error rejecting follow request:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while rejecting follow request",
      error: error.message,
    });
  }
};

// Send a follow request
export const sendFollowRequest = async (req, res) => {
  try {
    const userId = req.id;
    const { targetId } = req.params;

    if (!userId || !targetId) {
      return res.status(400).json({
        success: false,
        message: "User ID and target ID are required",
      });
    }

    if (userId === targetId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    // Find both users
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetId);

    if (!user || !targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if already following
    if (user.following.includes(targetId)) {
      return res.status(400).json({
        success: false,
        message: "You are already following this user",
      });
    }

    // Check if request already sent
    if (targetUser.followRequests.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "Follow request already sent",
      });
    }

    // Add the request
    await User.findByIdAndUpdate(targetId, {
      $push: { followRequests: userId },
    });

    return res.status(200).json({
      success: true,
      message: "Follow request sent",
    });
  } catch (error) {
    console.error("Error sending follow request:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while sending follow request",
      error: error.message,
    });
  }
};

// Cancel a follow request
export const cancelFollowRequest = async (req, res) => {
  try {
    const userId = req.id;
    const { targetId } = req.params;

    if (!userId || !targetId) {
      return res.status(400).json({
        success: false,
        message: "User ID and target ID are required",
      });
    }

    // Find both users
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetId);

    if (!user || !targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if request exists
    if (!targetUser.followRequests.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "No follow request found to cancel",
      });
    }

    // Remove the request
    await User.findByIdAndUpdate(targetId, {
      $pull: { followRequests: userId },
    });

    return res.status(200).json({
      success: true,
      message: "Follow request canceled",
    });
  } catch (error) {
    console.error("Error canceling follow request:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while canceling follow request",
      error: error.message,
    });
  }
};

// Check for unread messages
export const checkUnreadMessages = async (req, res) => {
  try {
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if there are unread messages
    const hasUnread = user.unreadMessages && user.unreadMessages.length > 0;

    return res.status(200).json({
      success: true,
      hasUnread,
    });
  } catch (error) {
    console.error("Error checking unread messages:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while checking unread messages",
      error: error.message,
    });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Mark messages as read
    await User.findByIdAndUpdate(userId, {
      $set: { unreadMessages: [] },
    });

    return res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while marking messages as read",
      error: error.message,
    });
  }
};
