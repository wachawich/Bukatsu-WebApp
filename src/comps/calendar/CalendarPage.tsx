import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { ActivityField, getActivity, getMyActivity } from '@/utils/api/activity';
import { decodeToken } from "@/utils/auth/jwt";

type ExtendedActivityField = ActivityField & {
  activity_type_data?: {
    activity_type_id: number;
    activity_type_name: string;
  }[];
  activity_subject_data?: {
    subject_id: number;
    subject_name: string;
  }[];
};

const getUserSysIdFromToken = (): number | null => {
  const user = decodeToken();
  const userSysId = user?.user_sys_id || null;
  return userSysId;
};


const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activity, setActivity] = useState<ExtendedActivityField[]>([]);
  const [myActivity, setMyActivity] = useState<ExtendedActivityField[]>([]);
  const [viewMode, setViewMode] = useState<'allActivity' | 'myActivity'>('allActivity');

  const isDateInRange = (date: Date, start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return startDate <= date && date <= endDate;
  };

  const fetchActivity = async (date: Date) => {
    const userSysId = getUserSysIdFromToken(); // ดึง user_sys_id จาก token

    if (!userSysId) {
      console.error('No user_sys_id found!');
      return;
    }

    try {
      
      const activityResponse = await getActivity({ flag_valid: true });
      const activity = activityResponse.data;

      // กรองกิจกรรมทั้งหมดให้ตรงกับวันที่เลือก
      const filteredActivity = activity.filter((activity: ActivityField) =>
        isDateInRange(date, activity.start_date, activity.end_date)
      );

      const myActivityResponse = await getMyActivity({ user_sys_id: userSysId });
      const myActivity = myActivityResponse.data;
      console.log("myActivity:",myActivity)

      const filteredMyActivity = myActivity.filter((activity: ActivityField) =>
        isDateInRange(date, activity.start_date, activity.end_date)
      );

      setActivity(filteredActivity);
      setMyActivity(filteredMyActivity);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  useEffect(() => {
    fetchActivity(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const displayedActivities = viewMode === 'allActivity' ? activity : myActivity;

  return (
    <div className="bg-gray-200 max-w-4xl m-auto my-12 py-12 px-20 rounded-2xl shadow-lg">
      <div className="max-w-3xl mx-auto">
        <Calendar
          onChange={(value) => value instanceof Date && handleDateChange(value)}
          value={selectedDate}
          calendarType="iso8601"
          locale="en-EN"
          tileClassName={({ date }) => {
            const isSelected = selectedDate.toDateString() === date.toDateString();
            const isToday = new Date().toDateString() === date.toDateString();

            return `
              ${isSelected ? 'bg-orange-500 text-white font-semibold' : ''}
              ${isToday ? 'bg-black text-white font-semibold' : ''}
            `;
          }}
          next2Label={null}
          prev2Label={null}
          formatMonthYear={(locale, date) => (
            <>
              <div className="mt-4">{date.toLocaleString(locale, { month: 'long' })}</div>
              <div className="text-sm font-normal text-gray-600">{date.getFullYear()}</div>
            </>
          )}
        />
      </div>

      {/* 🔘 ปุ่มเลือกดูประเภทกิจกรรม */}
      <div className="flex justify-center mt-4 space-x-4">
        <button
          className={`w-1/2 px-4 py-2 rounded-full font-semibold transition ${viewMode === 'allActivity'
              ? 'bg-orange-500 text-white hover:bg-orange-600'
              : 'bg-gray-300 text-black hover:bg-gray-400'
            }`}
          onClick={() => setViewMode('allActivity')}
        >
          กิจกรรมทั้งหมด
        </button>
        <button
          className={`w-1/2 px-4 py-2 rounded-full transition ${viewMode === 'myActivity'
              ? 'bg-orange-500 text-white hover:bg-orange-600'
              : 'bg-gray-300 text-black hover:bg-gray-400'
            }`}
          onClick={() => setViewMode('myActivity')}
        >
          กิจกรรมที่เข้าร่วม
        </button>
      </div>

      {/* 🗂 หัวข้อ */}
      <h2 className="text-xl font-bold mt-6">
        {viewMode === 'allActivity' ? 'กิจกรรมทั้งหมด' : 'กิจกรรมที่เข้าร่วม'}
      </h2>

      {/* 📋 รายการกิจกรรม */}
      <div className="flex justify-center mt-6">
        <div className="w-full max-w-3xl space-y-4">
          {displayedActivities.length === 0 ? (
            <p className="text-center text-gray-500">ไม่มีข้อมูลกิจกรรมในวันนี้</p>
          ) : (
            displayedActivities.map((activity) => (
              <div
                key={activity.activity_id}
                className="border rounded-lg p-4 shadow flex items-center hover:shadow-xl transition"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm text-center rounded-lg mr-4">
                  {/* image หรือ icon */}
                </div>
                <div className="flex-grow">
                  <div className="font-semibold text-lg">
                    {activity.title?.trim() || 'ไม่มีชื่อกิจกรรม'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {activity.description || 'ไม่มีคำอธิบาย'}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {activity.activity_type_data?.map((type) => (
                      <span
                        key={`type-${type.activity_type_id}`}
                        className="bg-orange-200 text-orange-600 px-3 py-1 text-sm"
                      >
                        {type.activity_type_name}
                      </span>
                    ))}
                    {activity.activity_subject_data?.map((subject) => (
                      <span
                        key={`subject-${subject.subject_id}`}
                        className="bg-orange-200 text-orange-600 px-3 py-1 text-sm"
                      >
                        {subject.subject_name}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="ml-4 bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded transition">
                  ดูเพิ่มเติม
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
