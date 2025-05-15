import React, { useEffect, useState, useMemo } from 'react';
import { ActivityField, getActivity, ActivityTypeField, getActivityType } from '@/utils/api/activity';
import { SubjectField, getSubject } from '@/utils/api/subject';
import ActivityCard from './activityCard';
import SubjectCard from './subjectCard';
import { getUser } from "@/utils/api/userData"

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

function Homepage() {
  const [activity, setActivity] = useState<ExtendedActivityField[]>([]);
  const [subjects, setSubjects] = useState<SubjectField[]>([]);
  const [types, setTypes] = useState<ActivityTypeField[]>([]);
  const [filterSubject, setFilterSubject] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<number | null>(null);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingTypes, setLoadingTypes] = useState(true);

  // ดึงข้อมูลกิจกรรม
  const fetchActivities = async () => {
    try {
      const response = await getActivity({ flag_valid: true });
      setActivity(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoadingActivity(false);
    }
  };

  // ดึงข้อมูลหมวดวิชา
  const fetchSubjects = async () => {
    try {
      const response = await getSubject({ show: true });
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoadingSubjects(false);
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await getActivityType({ show: true });
      setTypes(response.data);

    } catch (error) {
      console.error('Error fetching ActivityTypes:', error);
    } finally {
      setLoadingTypes(false);
    }

  }
  useEffect(() => {
    fetchTypes();
    fetchActivities();
    fetchSubjects();
  }, []);


  // คำนวณรายการกิจกรรมที่กรองแล้ว
  const filteredActivity = useMemo(() => {
    return activity.filter((activity) => {
      const matchSubject = !filterSubject || activity.activity_subject_data?.some(
        (subjects) => subjects.subject_id === filterSubject
      );
      const matchType = !filterType || activity.activity_type_data?.some(
        (types) => types.activity_type_id === filterType
      );
      return matchSubject && matchType;
    });
  }, [activity, filterSubject, filterType]);


  const handleSubjectClick = (subject_id: number) => {
    setFilterSubject(prev => (prev === subject_id ? null : subject_id));
  };

  const handleTypeClick = (type_id: number) => {
    setFilterType(prev => (prev === type_id ? null : type_id));
  };

  return (
    <div className="bg-white min-h-screen">

      <section className="bg-white py-12 px-4 md:px-16 space-y-12">
        {loadingSubjects ? (
          <div className="text-center text-gray-500">กำลังโหลดหมวดวิชา...</div>
        ) : subjects.length > 0 ? (
          <div className="flex justify-center gap-3 flex-wrap">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.subject_id}
                subject={subject}
                selected={filterSubject === subject.subject_id}
                onClick={() => handleSubjectClick(subject.subject_id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-red-500">ไม่พบข้อมูลหมวดวิชา</div>
        )}
      </section>

      <section className="bg-white mb-10 px-4 md:px-16 space-y-12 ">
        {loadingTypes ? (
          <div className="text-center text-gray-500">กำลังโหลดประเภทของกิจกรรม...</div>
        ) : types.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <button
              onClick={() => setFilterType(null)}
              className={`text-xs md:text-sm transition-all duration-200 ${filterType === null
                  ? 'text-orange-500 border-b-2 border-orange-500 font-semibold'
                  : 'text-gray-500 border-b-2 border-transparent hover:text-orange-500'
                }`}
            >
              กิจกรรมทั้งหมด
            </button>

            {types.map((type) => (
              <button
                key={type.activity_type_id}
                onClick={() => handleTypeClick(type.activity_type_id)}
                className={`text-xs md:text-sm transition-all duration-200 ${filterType === type.activity_type_id
                    ? 'text-orange-500 border-b-2 border-orange-500 font-semibold'
                    : 'text-gray-500 border-b-2 border-transparent hover:text-orange-500'
                  }`}
              >
                {type.activity_type_name}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center text-red-500">ไม่พบข้อมูลประเภทกิจกรรม</div>
        )}
      </section>


      <section className="bg-gray-200 py-4 px-6 md:py-10 md:px-16 space-y-4 h-full">
        <h2 className="text-2xl font-bold">กิจกรรมทั้งหมด</h2>
        {loadingActivity ? (
          <div className="text-center text-gray-500">กำลังโหลดกิจกรรม...</div>
        ) : filteredActivity.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredActivity.map((activity: any) => (
              <ActivityCard key={activity.activity_id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">ไม่มีกิจกรรมที่ตรงกับหมวดวิชานี้</div>
        )}
      </section>
    </div>
  );
}

export default Homepage;