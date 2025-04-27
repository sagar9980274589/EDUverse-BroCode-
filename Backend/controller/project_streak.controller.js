import User from '../model/user.model.js';
import ProjectActivity from '../model/project_activity.model.js';
import axios from 'axios';

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

// Record a project activity and update streak
export const recordProjectActivity = async (req, res) => {
  try {
    const userId = req.id;
    const { activityType, activityData, githubRepoId, githubRepoName, contributionCount = 1 } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // Create new activity record
    const newActivity = new ProjectActivity({
      user: userId,
      activityType,
      activityData,
      githubRepoId,
      githubRepoName,
      contributionCount,
      activityDate: new Date()
    });

    await newActivity.save();

    // Update user's streak
    const user = await User.findById(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get the current date as string for contribution history
    const todayStr = formatDate(today);

    // Initialize contribution history if it doesn't exist
    if (!user.projectContributionHistory) {
      user.projectContributionHistory = new Map();
    }

    // Update contribution count for today
    const currentContributions = user.projectContributionHistory.get(todayStr) || 0;
    user.projectContributionHistory.set(todayStr, currentContributions + contributionCount);

    // Update total contributions
    user.totalProjectContributions = (user.totalProjectContributions || 0) + contributionCount;

    // Update streak
    if (user.projectStreakLastUpdated) {
      const lastUpdated = new Date(user.projectStreakLastUpdated);
      lastUpdated.setHours(0, 0, 0, 0);

      if (isSameDay(lastUpdated, today)) {
        // Already updated today, just update the contribution count
        // Streak stays the same
      } else if (isDayBefore(lastUpdated, today)) {
        // Last activity was yesterday, increment streak
        user.projectStreak = (user.projectStreak || 0) + 1;
      } else {
        // Streak broken, reset to 1
        user.projectStreak = 1;
      }
    } else {
      // First activity, start streak at 1
      user.projectStreak = 1;
    }

    // Update last updated date
    user.projectStreakLastUpdated = today;

    // Update longest streak if current streak is longer
    if ((user.projectStreak || 0) > (user.longestProjectStreak || 0)) {
      user.longestProjectStreak = user.projectStreak;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Project activity recorded and streak updated",
      streak: user.projectStreak,
      longestStreak: user.longestProjectStreak,
      totalContributions: user.totalProjectContributions,
      activity: newActivity
    });
  } catch (error) {
    console.error("Error recording project activity:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to record project activity",
      error: error.message
    });
  }
};

// Get user's project streak info
export const getProjectStreakInfo = async (req, res) => {
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
    const recentActivities = await ProjectActivity.find({ user: userId })
      .sort({ activityDate: -1 })
      .limit(10);

    // Format contribution history for frontend
    const contributionHistory = {};
    if (user.projectContributionHistory) {
      for (const [date, count] of user.projectContributionHistory.entries()) {
        contributionHistory[date] = count;
      }
    }

    return res.status(200).json({
      success: true,
      streakInfo: {
        currentStreak: user.projectStreak || 0,
        longestStreak: user.longestProjectStreak || 0,
        totalContributions: user.totalProjectContributions || 0,
        lastUpdated: user.projectStreakLastUpdated,
        contributionHistory: contributionHistory
      },
      recentActivities
    });
  } catch (error) {
    console.error("Error getting project streak info:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get project streak info",
      error: error.message
    });
  }
};

// Sync GitHub contributions with our streak system
export const syncGitHubContributions = async (req, res) => {
  try {
    const userId = req.id;

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

    if (!user.githubUsername || !user.githubConnected) {
      return res.status(400).json({
        success: false,
        message: "GitHub account not connected"
      });
    }

    // Get GitHub contribution data
    // Note: GitHub doesn't have a public API for contribution data
    // This is a simplified version that just counts recent commits
    try {
      // Get recent commits from all repos
      const reposResponse = await axios.get(`https://api.github.com/users/${user.githubUsername}/repos`);
      
      let totalNewContributions = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Process each repository
      for (const repo of reposResponse.data) {
        // Skip forks
        if (repo.fork) continue;
        
        // Get commits for this repo
        const commitsResponse = await axios.get(
          `https://api.github.com/repos/${user.githubUsername}/${repo.name}/commits?author=${user.githubUsername}&since=${formatDate(new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000))}`
        );
        
        // Process each commit
        for (const commit of commitsResponse.data) {
          const commitDate = new Date(commit.commit.author.date);
          commitDate.setHours(0, 0, 0, 0);
          
          // Check if we already have this commit recorded
          const existingActivity = await ProjectActivity.findOne({
            user: userId,
            activityType: 'commit',
            'activityData.sha': commit.sha
          });
          
          if (!existingActivity) {
            // Record new commit
            const newActivity = new ProjectActivity({
              user: userId,
              activityType: 'commit',
              activityData: {
                sha: commit.sha,
                message: commit.commit.message,
                url: commit.html_url
              },
              githubRepoId: repo.id.toString(),
              githubRepoName: repo.name,
              activityDate: commitDate
            });
            
            await newActivity.save();
            totalNewContributions++;
            
            // Update contribution history
            const dateStr = formatDate(commitDate);
            const currentContributions = user.projectContributionHistory.get(dateStr) || 0;
            user.projectContributionHistory.set(dateStr, currentContributions + 1);
          }
        }
      }
      
      // Update total contributions
      user.totalProjectContributions = (user.totalProjectContributions || 0) + totalNewContributions;
      
      // Update streak
      if (totalNewContributions > 0) {
        // Check if we need to update the streak
        if (!user.projectStreakLastUpdated) {
          // First activity
          user.projectStreak = 1;
          user.projectStreakLastUpdated = today;
        } else {
          // Calculate streak based on contribution history
          let currentDate = new Date(today);
          let consecutiveDays = 0;
          
          // Count backwards from today to find consecutive days with contributions
          while (true) {
            const dateStr = formatDate(currentDate);
            const hasContribution = user.projectContributionHistory.get(dateStr) > 0;
            
            if (!hasContribution) break;
            
            consecutiveDays++;
            currentDate.setDate(currentDate.getDate() - 1);
          }
          
          user.projectStreak = consecutiveDays;
          user.projectStreakLastUpdated = today;
        }
        
        // Update longest streak if needed
        if ((user.projectStreak || 0) > (user.longestProjectStreak || 0)) {
          user.longestProjectStreak = user.projectStreak;
        }
      }
      
      await user.save();
      
      return res.status(200).json({
        success: true,
        message: "GitHub contributions synced successfully",
        newContributions: totalNewContributions,
        currentStreak: user.projectStreak,
        longestStreak: user.longestProjectStreak,
        totalContributions: user.totalProjectContributions
      });
    } catch (error) {
      console.error("GitHub API error:", error.response?.data || error.message);
      return res.status(429).json({
        success: false,
        message: "GitHub API rate limit exceeded or error occurred",
        error: error.response?.data?.message || error.message
      });
    }
  } catch (error) {
    console.error("Error syncing GitHub contributions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to sync GitHub contributions",
      error: error.message
    });
  }
};

// Get contribution heatmap data
export const getContributionHeatmap = async (req, res) => {
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

    // Format contribution history for heatmap
    const heatmapData = [];
    if (user.projectContributionHistory) {
      for (const [date, count] of user.projectContributionHistory.entries()) {
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
    console.error("Error getting contribution heatmap:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get contribution heatmap",
      error: error.message
    });
  }
};
