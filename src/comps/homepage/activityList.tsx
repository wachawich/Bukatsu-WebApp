import { useEffect, useState } from 'react';
import { ActivityField, getActivity } from '@/utils/api/activity';
import ActivityCard from './activityCard';

export default function ActivityList() {
  const [activities, setActivities] = useState<ActivityField[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getActivity({flag_valid : true});
        setActivities(response.data); // ตรวจสอบว่า `getActivity()` ส่งค่ามาเป็น array
      } catch (error) {
        console.error('An error occurred while fetching the activities:', error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="p-6 mx-16">
        <h1 className="text-2xl font-bold mb-4">กิจกรรมทั้งหมด</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <ActivityCard key={activity.activity_id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
}
