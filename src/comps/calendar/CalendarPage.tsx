import React, { useEffect, useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import { ActivityField, getActivity, getMyActivity } from '@/utils/api/activity';
import ActivityCard from '../homepage/activityCard';
import { decodeToken } from '@/utils/auth/jwt';

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
  return user?.user_sys_id || null;
};

const isDateInRange = (date: Date, start: string, end: string) => {
  const selectDate = new Date(date);
  selectDate.setHours(0, 0, 0, 0);

  const startDate = new Date(start);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(end);
  endDate.setHours(0, 0, 0, 0);

  return startDate <= selectDate && selectDate <= endDate;
};

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activity, setActivity] = useState<ExtendedActivityField[]>([]);
  const [myActivity, setMyActivity] = useState<ExtendedActivityField[]>([]);
  const [viewMode, setViewMode] = useState<'allActivity' | 'myActivity'>('allActivity');
  const [calendarView, setCalendarView] = useState<'month' | 'day'>('month');
  const [loadingAll, setLoadingAll] = useState(true);
  const [loadingMyActivity, setLoadingMyActivity] = useState(true);
  const [weekStartDate, setWeekStartDate] = useState<Date>(() => {
    const today = new Date();
    today.setDate(today.getDate() - today.getDay()); //  คำนวณและกำหนดวันที่เริ่มต้นของสัปดาห์
    return today;
  });



  const fetchAllActivity = async () => {
    try {
      const response = await getActivity({ flag_valid: true });
      setActivity(response.data);
    } catch (err) {
      console.error('Error fetching all activities:', err);
    } finally {
      setLoadingAll(false);
    }
  };

  const fetchMyActivity = async () => {
    const userSysId = getUserSysIdFromToken();
    if (!userSysId) return;

    try {
      const response = await getMyActivity({ user_sys_id: userSysId });
      setMyActivity(response.data);
    } catch (err) {
      console.error('Error fetching my activities:', err);
    } finally {
      setLoadingMyActivity(false);
    }
  };


  useEffect(() => {
    fetchAllActivity();
    fetchMyActivity();
  }, []);



  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 630) {
        setCalendarView('day');
      } else {
        setCalendarView('month'); 
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

//for  mobile 
  const handleWeekChange = (direction: 'prev' | 'next') => {
    const newWeekStart = new Date(weekStartDate);
    newWeekStart.setDate(newWeekStart.getDate() + (direction === 'prev' ? -7 : 7));
    setWeekStartDate(newWeekStart);
  };


  const displayedActivities = useMemo(() => {
    const list = viewMode === 'allActivity' ? activity : myActivity;
    return list.filter((activity) =>
      isDateInRange(selectedDate, activity.start_date, activity.end_date)
    );
  }, [selectedDate, activity, myActivity, viewMode]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };


  return (
    <div className="bg-gray-200 max-w-4xl mx-auto my-6 px-4 py-8 shadow-lg md:px-20 sm:px-8 sm:rounded-2xl">
      <div className="max-w-full sm:max-w-3xl mx-auto">
        {calendarView === 'month' ? (
          <Calendar
            onChange={(value) => value instanceof Date && handleDateChange(value)}
            value={selectedDate}
            calendarType="iso8601"
            locale="en-EN"
            tileClassName={({ date }) => {
              const isSelected = selectedDate.toDateString() === date.toDateString();
              const isToday = new Date().toDateString() === date.toDateString();

              return `
                ${isSelected ? 'bg-orange-500 text-white font-semibold rounded-full' : ''}
                ${isToday ? 'bg-black text-white font-semibold rounded-full' : ''}
              `;
            }}
            next2Label={null}
            prev2Label={null}
            formatMonthYear={(locale, date) => (
              <>
                <div className="mt-4 text-base">{date.toLocaleString(locale, { month: 'long' })}</div>
                <div className="text-sm font-medium text-gray-600">{date.getFullYear()}</div>
              </>
            )}
          />
        ) : (
          <div className="flex flex-col gap-2 py-2">
            <div className="text-start text-xl font-bold">
              {weekStartDate.toLocaleString('en-EN', { month: 'long', year: 'numeric' }).replace(' ', ', ')}
            </div>
            <div className="flex items-center justify-between gap-2 mt-4">
              <button
                onClick={() => handleWeekChange('prev')}
                className="w-10 h-10 flex items-center justify-center bg-gray-300 text-black rounded-full text-xl shrink-0"
              >
                ‹
              </button>

              <div className="flex flex-1 justify-between overflow-x-auto gap-3">
                {Array.from({ length: 7 }).map((_, index) => {
                  const date = new Date(weekStartDate);
                  date.setDate(weekStartDate.getDate() + index);
                  const isSelected = selectedDate.toDateString() === date.toDateString();
                  const isToday = new Date().toDateString() === date.toDateString();

                  return (
                    <button
                      key={index}
                      onClick={() => handleDateChange(date)}
                      className={`flex-shrink-0 min-w-12 h-20 rounded-xl px-3 py-2 text-sm font-medium text-center transition
                       ${isSelected ? 'bg-orange-500 text-white font-semibold' : ''}
                       ${!isSelected && isToday ? 'bg-black text-white font-semibold' : ''}
                       ${!isSelected && !isToday ? 'bg-white text-gray-800' : ''}
                      `}
                    >
                      <div className="text-xs">
                        {date.toLocaleDateString('en-EN', { weekday: 'short' })}
                      </div>
                      <div>{date.getDate()}</div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handleWeekChange('next')}
                className="w-10 h-10 flex items-center justify-center bg-gray-300 text-black rounded-full text-xl shrink-0"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>


      <div className="flex justify-center mt-6 gap-2 sm:flex justify-center ">
        <button
          className={`w-1/2 sm:w-1/2 px-4 py-2 rounded-full font-semibold transition text-sm sm:text-base ${viewMode === 'allActivity'
            ? 'bg-orange-500 text-white hover:bg-orange-600'
            : 'bg-gray-300 text-black hover:bg-gray-400'
            }`}
          onClick={() => setViewMode('allActivity')}
        >
          กิจกรรมทั้งหมด
        </button>
        <button
          className={`w-1/2 sm:w-1/2 px-4 py-2 rounded-full font-semibold transition text-sm sm:text-base ${viewMode === 'myActivity'
            ? 'bg-orange-500 text-white hover:bg-orange-600'
            : 'bg-gray-300 text-black hover:bg-gray-400'
            }`}
          onClick={() => setViewMode('myActivity')}
        >
          กิจกรรมที่เข้าร่วม
        </button>
      </div>

      <h2 className="text-lg sm:text-xl font-bold mt-6 text-left">
        {viewMode === 'allActivity' ? 'กิจกรรมทั้งหมด' : 'กิจกรรมที่เข้าร่วม'}
      </h2>

      <div className="flex justify-center mt-4">
        <div className="w-full space-y-4">
          {loadingAll || loadingMyActivity ? (
            <p className="text-center text-gray-500">กำลังโหลดข้อมูลกิจกรรม...</p>
          ) : displayedActivities.length === 0 ? (
            <p className="text-center text-gray-500">ไม่มีข้อมูลกิจกรรมในวันนี้</p>
          ) : (
            displayedActivities.map((activity) => (
              <div key={activity.activity_id}>
                <ActivityCard activity={activity} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
