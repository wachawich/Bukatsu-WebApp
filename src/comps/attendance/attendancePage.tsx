import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getActivity, getActivityAttendance } from '@/utils/api/activity';
import AttendanceCard from './attendanceCard';

const AttendancePage = () => {
  const router = useRouter();
  const { activity_id } = router.query;

  const [activityTitle, setActivityTitle] = useState('');
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'joined' | 'applied'>('joined');

  useEffect(() => {
  const fetchActivityData = async () => {
    if (!router.isReady || !router.query.activity_id) {
      console.error("Activity ID is missing!");
      return;
    }

    console.log("Activity ID:", router.query.activity_id);

    try {
      const activityData = await getActivity({ activity_id: Number(router.query.activity_id) });
      console.log("Activity Data:", JSON.stringify(activityData, null, 2));

      if (activityData?.data?.length > 0) {
        setActivityTitle(activityData.data[0]?.title || 'กิจกรรมไม่พบ');
      }

      const attendanceData = await getActivityAttendance({ 
        activity_id: Number(router.query.activity_id),
        approve: activeTab === 'joined'
      });

      console.log("Full Attendance Data:", JSON.stringify(attendanceData, null, 2));

      if (attendanceData?.data?.length > 0) {
        const firstEntry = attendanceData.data[0];
        
        // แก้ไขให้ดึงข้อมูลจาก `attendance_data`
        const extractedParticipants = firstEntry.attendance_data || [];
        console.log("Extracted Participants:", extractedParticipants);
        console.log("Participants Data:", JSON.stringify(participants, null, 2));
        setParticipants(extractedParticipants);
      } else {
        console.warn("No participants found in Attendance Data:", attendanceData?.data);
        setParticipants([]);
      }
    } catch (error) {
      console.error('Error fetching activity data:', error);
    }

    setLoading(false);
  };

  fetchActivityData();
}, [router.isReady, router.query.activity_id, activeTab]);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">{loading ? 'กำลังโหลด...' : activityTitle}</h1>

      <div className="flex mb-4">
        <button
          onClick={() => setActiveTab('joined')}
          className={`w-1/2 px-4 py-2 rounded-l-full font-bold text-sm ${
            activeTab === 'joined' ? 'bg-orange-500 text-white' : 'bg-gray-300'
          }`}
        >
          สมาชิกที่เข้าร่วม
        </button>
        <button
          onClick={() => setActiveTab('applied')}
          className={`w-1/2 px-4 py-2 rounded-r-full font-bold text-sm ${
            activeTab === 'applied' ? 'bg-orange-500 text-white' : 'bg-gray-300'
          }`}
        >
          คนที่สมัคร
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
      ) : participants.length === 0 ? (
        <p className="text-gray-500">ไม่มีข้อมูลผู้เข้าร่วม</p>
      ) : (
        <table className="w-full border-collapse">
          <thead className="bg-orange-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Gender</th>
              <th className="p-2 border">Phone</th>
              {activeTab === 'applied' && <th className="p-2 border">Action</th>}
            </tr>
          </thead>
          <tbody>
            {participants.map((p, i) => (
              <AttendanceCard key={i} participant={p} activeTab={activeTab} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendancePage;
