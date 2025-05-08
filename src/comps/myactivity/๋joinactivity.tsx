import React, { useEffect, useState } from "react";
import { ActivityField, getActivity } from "@/utils/api/activity";

const JoinedActivity = () => {
  const [activities, setActivities] = useState<ActivityField[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getActivity(); // สมมุติว่า API นี้เรียกกิจกรรมทั้งหมด
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">กิจกรรมที่คุณเข้าร่วม</h2>

      {isLoading ? (
        <div className="text-center text-gray-500">กำลังโหลด...</div>
      ) : activities.length === 0 ? (
        <div className="text-center text-gray-500">คุณยังไม่ได้เข้าร่วมกิจกรรมใด</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-orange-500">{activity.title}</h3>
              <p className="text-gray-700 mb-2">{activity.description}</p>
              <p className="text-sm text-gray-500">
                วันที่: {activity.start_date} - {activity.end_date}
              </p>
              <p className="text-sm text-gray-500">จำนวนผู้เข้าร่วม: {activity.user_count}</p>
              <p className="text-sm text-gray-500">สถานที่: {activity.location_id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JoinedActivity;
