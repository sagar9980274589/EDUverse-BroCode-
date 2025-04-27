import User from "../model/user.model.js";

// Search users by text and/or facial embeddings
export const searchUsers = async (req, res) => {
  try {
    const { query, facialEmbeddings } = req.body;
    const userId = req.id; // Current user ID from auth middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Base filter to exclude current user
    const filter = { _id: { $ne: userId } };

    // Text-based search
    if (query && query.trim() !== "") {
      filter.$or = [
        { username: { $regex: query, $options: "i" } },
        { fullname: { $regex: query, $options: "i" } },
      ];
    }

    // Get users based on filter
    const users = await User.find(filter)
      .select("_id username fullname profile userType facialEmbeddings")
      .limit(20);

    // If facial embeddings are provided, calculate similarity scores
    if (facialEmbeddings && Array.isArray(facialEmbeddings) && facialEmbeddings.length === 128) {
      // Filter users with valid facial embeddings
      const usersWithFace = users.filter(
        (user) => user.facialEmbeddings && Array.isArray(user.facialEmbeddings) && user.facialEmbeddings.length === 128
      );

      // Calculate Euclidean distance for each user
      const usersWithScores = usersWithFace.map((user) => {
        const distance = euclideanDistance(facialEmbeddings, user.facialEmbeddings);
        return {
          ...user.toObject(),
          matchScore: distance,
          matchType: query && query.trim() !== "" ? "Text & Face Match" : "Face Match",
        };
      });

      // Sort by match score (lower is better)
      usersWithScores.sort((a, b) => a.matchScore - b.matchScore);

      // Filter to only include good matches (threshold can be adjusted)
      const goodMatches = usersWithScores.filter((user) => user.matchScore < 0.6);

      // If we have text query, add text-only matches
      if (query && query.trim() !== "") {
        const textOnlyUsers = users
          .filter((user) => !usersWithFace.some((u) => u._id.toString() === user._id.toString()))
          .map((user) => ({
            ...user.toObject(),
            matchType: "Text Match",
          }));

        // Combine results
        return res.status(200).json({
          success: true,
          users: [...goodMatches, ...textOnlyUsers],
        });
      }

      // Return face matches only
      return res.status(200).json({
        success: true,
        users: goodMatches,
      });
    }

    // If no facial embeddings, return text matches only
    return res.status(200).json({
      success: true,
      users: users.map((user) => ({
        ...user.toObject(),
        matchType: "Text Match",
      })),
    });
  } catch (error) {
    console.error("Error in searchUsers:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while searching users",
      error: error.message,
    });
  }
};

// Helper function to calculate Euclidean distance between two embedding arrays
const euclideanDistance = (arr1, arr2) => {
  if (!arr1 || !arr2 || arr1.length !== arr2.length) return Infinity;
  return Math.sqrt(
    arr1.reduce((sum, value, index) => sum + Math.pow(value - arr2[index], 2), 0)
  );
};
