import User from '../model/user.model.js';
import LearningActivity from '../model/learning_activity.model.js';
import Course from '../model/course.model.js';

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Helper function to check if two dates are the same day
const isSameDay = (date1, date2) => {
  return formatDate(date1) === formatDate(date2);
};

// Helper function to check if date1 is the day before date2
const isDayBefore = (date1, date2) => {
  const day1 = new Date(date1);
  const day2 = new Date(date2);
  day1.setHours(0, 0, 0, 0);
  day2.setHours(0, 0, 0, 0);
  
  // Set day2 to previous day
  day2.setDate(day2.getDate() - 1);
  
  return day1.getTime() === day2.getTime();
};

// Record a learning activity and update streak
export const recordLearningActivity = async (req, res) => {
  try {
    const userId = req.id;
    const { 
      activityType, 
      courseId, 
      contentId, 
      contentTitle, 
      activityData, 
      activityDuration = 0,
      activityPoints = 1
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // Get course name if courseId is provided
    let courseName = "";
    if (courseId) {
      const course = await Course.findById(courseId);
      if (course) {
        courseName = course.title;
      }
    }

    // Create new activity record
    const newActivity = new LearningActivity({
      user: userId,
      activityType,
      courseId,
      courseName,
      contentId,
      contentTitle,
      activityData,
      activityDuration,
      activityPoints,
      activityDate: new Date()
    });

    await newActivity.save();

    // Update user's streak
    const user = await User.findById(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get the current date as string for activity history
    const todayStr = formatDate(today);

    // Initialize activity history if it doesn't exist
    if (!user.learningActivityHistory) {
      user.learningActivityHistory = new Map();
    }

    // Update activity count for today
    const currentActivities = user.learningActivityHistory.get(todayStr) || 0;
    user.learningActivityHistory.set(todayStr, currentActivities + activityPoints);

    // Update total activities
    user.totalLearningActivities = (user.totalLearningActivities || 0) + activityPoints;

    // Update streak
    if (user.learningStreakLastUpdated) {
      const lastUpdated = new Date(user.learningStreakLastUpdated);
      lastUpdated.setHours(0, 0, 0, 0);

      if (isSameDay(lastUpdated, today)) {
        // Already updated today, just update the activity count
        // Streak stays the same
      } else if (isDayBefore(lastUpdated, today)) {
        // Last activity was yesterday, increment streak
        user.learningStreak = (user.learningStreak || 0) + 1;
      } else {
        // Streak broken, reset to 1
        user.learningStreak = 1;
      }
    } else {
      // First activity, start streak at 1
      user.learningStreak = 1;
    }

    // Update last updated date
    user.learningStreakLastUpdated = today;

    // Update longest streak if current streak is longer
    if ((user.learningStreak || 0) > (user.longestLearningStreak || 0)) {
      user.longestLearningStreak = user.learningStreak;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Learning activity recorded and streak updated",
      streak: user.learningStreak,
      longestStreak: user.longestLearningStreak,
      totalActivities: user.totalLearningActivities,
      activity: newActivity
    });
  } catch (error) {
    console.error("Error recording learning activity:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to record learning activity",
      error: error.message
    });
  }
};

// Get user's learning streak info
export const getLearningStreakInfo = async (req, res) => {
  try {
    const userId = req.params.userId || req.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Get recent activities
    const recentActivities = await LearningActivity.find({ user: userId })
      .sort({ activityDate: -1 })
      .limit(10);

    // Format activity history for frontend
    const activityHistory = {};
    if (user.learningActivityHistory) {
      for (const [date, count] of user.learningActivityHistory.entries()) {
        activityHistory[date] = count;
      }
    }

    return res.status(200).json({
      success: true,
      streakInfo: {
        currentStreak: user.learningStreak || 0,
        longestStreak: user.longestLearningStreak || 0,
        totalActivities: user.totalLearningActivities || 0,
        lastUpdated: user.learningStreakLastUpdated,
        activityHistory: activityHistory
      },
      recentActivities
    });
  } catch (error) {
    console.error("Error getting learning streak info:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get learning streak info",
      error: error.message
    });
  }
};

// Get activity heatmap data
export const getActivityHeatmap = async (req, res) => {
  try {
    const userId = req.params.userId || req.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Format activity history for heatmap
    const heatmapData = [];
    if (user.learningActivityHistory) {
      for (const [date, count] of user.learningActivityHistory.entries()) {
        heatmapData.push({
          date,
          count
        });
      }
    }

    return res.status(200).json({
      success: true,
      heatmapData
    });
  } catch (error) {
    console.error("Error getting activity heatmap:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get activity heatmap",
      error: error.message
    });
  }
};

// Get user's learning statistics
export const getLearningStats = async (req, res) => {
  try {
    const userId = req.params.userId || req.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // Get all user activities
    const activities = await LearningActivity.find({ user: userId });
    
    // Calculate stats
    const stats = {
      totalActivities: activities.length,
      totalTimeSpent: activities.reduce((total, activity) => total + (activity.activityDuration || 0), 0),
      activitiesByType: {},
      activitiesByCourse: {},
      activitiesByDay: {
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0
      },
      activitiesByHour: Array(24).fill(0)
    };

    // Process activities
    activities.forEach(activity => {
      // Count by type
      if (!stats.activitiesByType[activity.activityType]) {
        stats.activitiesByType[activity.activityType] = 0;
      }
      stats.activitiesByType[activity.activityType]++;

      // Count by course
      if (activity.courseId) {
        const courseKey = activity.courseId.toString();
        if (!stats.activitiesByCourse[courseKey]) {
          stats.activitiesByCourse[courseKey] = {
            id: courseKey,
            name: activity.courseName || 'Unknown Course',
            count: 0,
            timeSpent: 0
          };
        }
        stats.activitiesByCourse[courseKey].count++;
        stats.activitiesByCourse[courseKey].timeSpent += (activity.activityDuration || 0);
      }

      // Count by day of week
      const date = new Date(activity.activityDate);
      const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
      stats.activitiesByDay[dayOfWeek]++;

      // Count by hour
      const hour = date.getHours();
      stats.activitiesByHour[hour]++;
    });

    // Convert activitiesByCourse from object to array
    stats.activitiesByCourse = Object.values(stats.activitiesByCourse);

    return res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error("Error getting learning stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get learning stats",
      error: error.message
    });
  }
};
