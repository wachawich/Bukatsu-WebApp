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
        return;
      }

      try {
        const activityData = await getActivity({ activity_id: Number(router.query.activity_id) });

        if (activityData?.data?.length > 0) {
          setActivityTitle(activityData.data[0]?.title || 'กิจกรรมไม่พบ');
        }

        const attendanceData = await getActivityAttendance({ 
          activity_id: Number(router.query.activity_id),
          approve: activeTab === 'joined'
        });

        if (attendanceData?.data?.length > 0) {
          setParticipants(attendanceData.data[0]?.attendance_data || []);
        } else {
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
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">{loading ? 'กำลังโหลด...' : activityTitle}</h1>

      <div className="flex flex-col md:flex-row mb-4">
        <button
          onClick={() => setActiveTab('joined')}
          className={`w-full md:w-1/2 px-4 py-2 rounded-t-md md:rounded-l-full font-bold text-3sm ${
            activeTab === 'joined' ? 'bg-orange-500 text-white' : 'bg-gray-300'
          }`}
        >
          ผู้เข้าร่วมกิจกรรม
        </button>
        <button
          onClick={() => setActiveTab('applied')}
          className={`w-full md:w-1/2 px-4 py-2 rounded-b-md md:rounded-r-full font-bold text-sm ${
            activeTab === 'applied' ? 'bg-orange-500 text-white' : 'bg-gray-300'
          }`}
        >
          ผู้สมัครเข้าร่วมกิจกรรม
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">กำลังโหลดข้อมูล...</p>
      ) : participants.length === 0 ? (
        <p className="text-gray-500 text-center">ไม่มีข้อมูลผู้เข้าร่วม</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-orange-100">
              <tr>
                <th className="p-2 border text-left">ชื่อ</th>
                <th className="p-2 border text-left">Role</th>
                <th className="p-2 border text-left">เพศ</th>
                <th className="p-2 border text-left">เบอร์โทรศัพท์</th>
                {activeTab === 'applied' && <th className="p-2 border text-left">สถานะ</th>}
              </tr>
            </thead>
            <tbody>
              {participants.map((p, i) => (
                <AttendanceCard key={i} participant={p} activeTab={activeTab} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
