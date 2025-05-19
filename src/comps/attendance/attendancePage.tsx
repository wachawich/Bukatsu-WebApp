import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getActivity, getActivityAttendance,approveActivity  } from '@/utils/api/activity';
import { getRole } from '@/utils/api/roleData';  
import AttendanceCard from './attendanceCard';


type Participant = {
  user_sys_id: string;
  user_first_name: string;
  user_last_name: string;
  role_id: number;
  role_name?: string;
  sex: string;
  phone: string;
};

const AttendancePage = () => {
  const router = useRouter();
  const { activity_id } = router.query;

  const [activityTitle, setActivityTitle] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'joined' | 'applied'>('joined');
  const [roles, setRoles] = useState<{ [key: number]: string }>({}); // Ensure roles state exists

  // Define fetchRoles function
  const fetchRoles = async () => {
    try {
      const res = await getRole({});
      const roleMap: { [key: number]: string } = {};
      if (res?.data?.length > 0) {
        res.data.forEach((role: any) => {
          roleMap[role.role_id] = role.role_name;
        });
      }
      setRoles(roleMap);
    } catch (err) {
      console.error('Error loading roles:', err);
    }
  };

  // Define fetchActivityData outside useEffect
  const fetchActivityData = async () => {
    if (!router.isReady || !router.query.activity_id) {
      return;
    }

    setLoading(true);

    try {
      const activityData = await getActivity({ activity_id: Number(router.query.activity_id) });
      if (activityData?.data?.length > 0) {
        setActivityTitle(activityData.data[0]?.title || 'Activity not found');
      }

      const attendanceData = await getActivityAttendance({
        activity_id: Number(router.query.activity_id),
        approve: activeTab === 'joined',
      });

      if (attendanceData?.data?.length > 0) {
        const attendanceList = attendanceData.data[0]?.attendance_data || [];
        const updatedParticipants = attendanceList.map((p: Participant) => ({
          ...p,
          role_name: roles[p.role_id] || 'Unknown',
        }));
        setParticipants(updatedParticipants);
      } else {
        setParticipants([]);
      }
    } catch (error) {
      console.error('Error fetching activity data:', error);
    }

    setLoading(false);
  };

  // useEffect(() => {
  //   fetchRoles(); // Fetch roles when the component mounts
  //   fetchActivityData(); // Fetch activity data
  // }, [router.isReady, router.query.activity_id, activeTab, roles]);

  // Fix handleApprove function
  const handleApprove = async (userSysId: number) => {
    try {
      await approveActivity({
        user_sys_id: userSysId,
        activity_id: Number(activity_id), // Ensure activity_id is converted properly
        approve: true,
        flag_valid: true,
      });

      fetchActivityData(); // Now accessible globally
    } catch (error) {
      console.error('Error approving participant:', error);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">{loading ? 'Loading...' : activityTitle}</h1>
      <div className="flex flex-col md:flex-row mb-4">
        <button
          onClick={() => setActiveTab('joined')}
          className={`w-full md:w-1/2 px-4 py-2 rounded-t-md md:rounded-l-full font-bold text-sm ${
            activeTab === 'joined' ? 'bg-orange-500 text-white' : 'bg-gray-300'
          }`}
        >
          Participants
        </button>
        <button
          onClick={() => setActiveTab('applied')}
          className={`w-full md:w-1/2 px-4 py-2 rounded-b-md md:rounded-r-full font-bold text-sm ${
            activeTab === 'applied' ? 'bg-orange-500 text-white' : 'bg-gray-300'
          }`}
        >
          Applicants
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Loading data...</p>
      ) : participants.length === 0 ? (
        <p className="text-gray-500 text-center">No participants found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-orange-100">
              <tr>
                <th className="p-2 border text-left">Name</th>
                <th className="p-2 border text-left">Role</th>
                <th className="p-2 border text-left">Gender</th>
                <th className="p-2 border text-left">Phone</th>
                {activeTab === 'applied' && <th className="p-2 border text-left">Status</th>}
              </tr>
            </thead>
            <tbody>
              {participants.map((p, i) => (
                <AttendanceCard key={i} participant={p} activeTab={activeTab} onApprove={handleApprove} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
