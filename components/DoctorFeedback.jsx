"use client";
import { useState, useEffect } from "react";

export default function DoctorFeedback({ doctorId }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doctorId) {
      fetchFeedbacks();
      const interval = setInterval(fetchFeedbacks, 30000);
      return () => clearInterval(interval);
    }
  }, [doctorId]);

  const fetchFeedbacks = async () => {
    try {
      console.log('Fetching feedbacks for doctor:', doctorId);
      const response = await fetch(`/api/doctor/feedback?doctorId=${doctorId}`);
      const data = await response.json();
      console.log('Feedback response:', data);
      if (response.ok) {
        setFeedbacks(data.feedbacks || []);
        console.log('Set feedbacks:', data.feedbacks?.length || 0);
      } else {
        console.error('Feedback API error:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading feedbacks...</div>;
  }

  if (feedbacks.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-400 text-4xl mb-2">⭐</div>
        <p className="text-gray-500">No feedback yet</p>
        <p className="text-sm text-gray-400 mt-1">Patient feedback will appear here</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
        {feedbacks.map((feedback) => (
          <div key={feedback._id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {feedback.userId?.name || 'Anonymous'}
                </span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-sm ${
                        feedback.rating >= star ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs ${
                feedback.satisfied 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {feedback.satisfied ? '😊 Satisfied' : '😞 Not Satisfied'}
              </div>
            </div>
            {feedback.comment && (
              <p className="text-gray-600 text-sm mb-2">"{feedback.comment}"</p>
            )}
            <div className="flex justify-between text-xs text-gray-500">
              <span>{feedback.sessionType} session</span>
              <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}