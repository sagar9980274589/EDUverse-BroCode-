import Comment from '../model/comment.model.js';
import Post from '../model/post.model.js';
import User from '../model/user.model.js';
import mongoose from 'mongoose';

// Add a new comment to a post
export const addComment = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const userId = req.id; // Using req.id from auth middleware

    if (!postId || !comment) {
      return res.status(400).json({ message: 'Post ID and comment are required' });
    }

    // Check if post exists
    const postExists = await Post.findById(postId);
    if (!postExists) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create new comment
    const newComment = new Comment({
      author: userId,
      post: postId,
      comment: comment
    });

    // Save comment
    await newComment.save();

    // Update the post's comments array
    await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: newComment._id } }
    );

    // Populate author details
    const populatedComment = await Comment.findById(newComment._id)
      .populate('author', 'username fullname profile')
      .lean();

    return res.status(201).json({
      message: 'Comment added successfully',
      comment: populatedComment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all comments for a post
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    // Check if post exists
    const postExists = await Post.findById(postId);
    if (!postExists) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Get comments for the post
    const comments = await Comment.find({ post: postId })
      .populate('author', 'username fullname profile')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      message: 'Comments retrieved successfully',
      comments
    });
  } catch (error) {
    console.error('Error getting comments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.id; // Using req.id from auth middleware

    if (!commentId) {
      return res.status(400).json({ message: 'Comment ID is required' });
    }

    // Check if comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author of the comment
    if (comment.author.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment' });
    }

    // Get the post ID before deleting the comment
    const postId = comment.post;

    // Delete comment
    await Comment.findByIdAndDelete(commentId);

    // Remove the comment from the post's comments array
    await Post.findByIdAndUpdate(
      postId,
      { $pull: { comments: commentId } }
    );

    return res.status(200).json({
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a comment
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { comment } = req.body;
    const userId = req.id; // Using req.id from auth middleware

    if (!commentId || !comment) {
      return res.status(400).json({ message: 'Comment ID and updated comment are required' });
    }

    // Check if comment exists
    const existingComment = await Comment.findById(commentId);
    if (!existingComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author of the comment
    if (existingComment.author.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this comment' });
    }

    // Update comment
    existingComment.comment = comment;
    await existingComment.save();

    // Populate author details
    const updatedComment = await Comment.findById(commentId)
      .populate('author', 'username fullname profile')
      .lean();

    return res.status(200).json({
      message: 'Comment updated successfully',
      comment: updatedComment
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
