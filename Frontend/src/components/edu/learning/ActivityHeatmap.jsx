import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ActivityHeatmap = ({ userId }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeatmapData();
  }, [userId]);

  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        userId ? `http://localhost:3000/learning/heatmap/${userId}` : 'http://localhost:3000/learning/heatmap',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setHeatmapData(response.data.heatmapData || []);
      } else {
        console.error('Failed to fetch heatmap data');
      }
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate last 12 weeks of dates
  const generateCalendarData = () => {
    const today = new Date();
    const numWeeks = 12;
    const days = numWeeks * 7;

    // Create an array of the last 'days' days
    const dateArray = Array.from({ length: days }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (days - i - 1));
      return {
        date: date.toISOString().split('T')[0],
        count: 0,
        dayOfWeek: date.getDay()
      };
    });

    // Fill in the counts from heatmapData
    heatmapData.forEach(item => {
      const index = dateArray.findIndex(d => d.date === item.date);
      if (index !== -1) {
        dateArray[index].count = item.count;
      }
    });

    // Group by week
    const weekArray = [];
    for (let i = 0; i < dateArray.length; i += 7) {
      weekArray.push(dateArray.slice(i, i + 7));
    }

    return weekArray;
  };

  const getColorClass = (count) => {
    if (count === 0) return 'bg-gray-100';
    if (count < 3) return 'bg-indigo-100';
    if (count < 5) return 'bg-indigo-300';
    if (count < 8) return 'bg-indigo-500';
    return 'bg-indigo-700';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="h-32 bg-gray-50 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-sm text-gray-400">Loading activity data...</div>
      </div>
    );
  }

  const calendarData = generateCalendarData();

  // If no data, show empty state
  if (heatmapData.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-500">No activity data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-full p-1">
          <div className="flex mb-1">
            <div className="w-6"></div>
            <div className="flex-1 flex justify-between text-xs text-gray-400 px-1">
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (12 - i - 1) * 7);
                return (
                  <div key={i} className="text-center">
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex">
            <div className="w-6 flex flex-col justify-around text-xs text-gray-400">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-1">
              {calendarData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-4 h-4 rounded-sm ${getColorClass(day.count)}`}
                      title={`${formatDate(day.date)}: ${day.count} activities`}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <div className="flex items-center text-xs text-gray-500">
              <span>Less</span>
              <div className="flex mx-1">
                <div className="w-3 h-3 bg-gray-100 rounded-sm mx-px"></div>
                <div className="w-3 h-3 bg-indigo-100 rounded-sm mx-px"></div>
                <div className="w-3 h-3 bg-indigo-300 rounded-sm mx-px"></div>
                <div className="w-3 h-3 bg-indigo-500 rounded-sm mx-px"></div>
                <div className="w-3 h-3 bg-indigo-700 rounded-sm mx-px"></div>
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
