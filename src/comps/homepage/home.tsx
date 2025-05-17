import React, { useEffect, useState, useMemo } from 'react';
import { ActivityField, getActivity, ActivityTypeField, getActivityType } from '@/utils/api/activity';
import { SubjectField, getSubject } from '@/utils/api/subject';
import HomepageActivityCard from './homepageActivityCard';
import SubjectCard from './subjectCard';
import Footer from "@/comps/Footer/Footer";

import { useRouter } from "next/router.js";
import { getUser } from "@/utils/api/userData";
import { IconSearch } from "@tabler/icons-react";

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
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
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
    fetchActivities();
  }, []);

  useEffect(() => {
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
    fetchSubjects();
  }, []);


  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await getActivityType({ show: true });
        setTypes(response.data);

      } catch (error) {
        console.error('Error fetching ActivityTypes:', error);
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchTypes();
  }, []);

  const filteredActivity = useMemo(() => {
    const sorted = activity
      .slice()
      .sort((a, b) => {
        const dateA = new Date(a.start_date).getTime();
        const dateB = new Date(b.start_date).getTime();
        return dateB - dateA;
      });

    return sorted.filter((activity) => {
      const matchSubject =
        !filterSubject ||
        activity.activity_subject_data?.some(
          (subject) => subject.subject_id === filterSubject
        );
      const matchType =
        !filterType ||
        activity.activity_type_data?.some(
          (type) => type.activity_type_id === filterType
        );
      const matchSearch = searchTerm.trim() === '' ||
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.activity_type_data?.some(type =>
          type.activity_type_name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      return matchSubject && matchType && matchSearch;
    });
  }, [activity, filterSubject, filterType, searchTerm]);



  const handleSubjectClick = (subject_id: number) => {
    setFilterSubject(prev => (prev === subject_id ? null : subject_id));
  };

  const handleTypeClick = (type_id: number) => {
    setFilterType(prev => (prev === type_id ? null : type_id));
  };

  const filteredTitle = useMemo(() => {
    const subjectName = filterSubject
      ? subjects.find((s) => s.subject_id === filterSubject)?.subject_name
      : null;

    const typeName = filterType
      ? types.find((t) => t.activity_type_id === filterType)?.activity_type_name
      : null;

    if (subjectName && typeName) return `${typeName} Activity in ${subjectName}`;
    if (subjectName) return `Activity in ${subjectName}`;
    if (typeName) return `${typeName} Activity`;

    return 'All Activity';
  }, [filterSubject, filterType, subjects, types]);


  return (
    <div className="bg-white min-h-screen">
      <section className="bg-white py-12 px-4 md:px-8 lg:px-16 space-y-12 mx-auto">
        {loadingSubjects ? (
          <div className="text-center text-gray-500 ">Loading subjects...</div>
        ) : subjects.length > 0 ? (
          <div className="flex justify-center gap-1 md:gap-3 flex-wrap">
            <button
              onClick={() => setFilterSubject(null)}
              className={`flex flex-col items-center text-center w-20 sm:w-24 md:w-28 text-xs sm:text-sm group`}
            >
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center rounded cursor-pointer overflow-hidden transition
                ${filterSubject === null
                    ? 'border-2 bg-orange-500 text-white border-orange-500'
                    : 'border-2 text-black border-orange-500 hover:bg-orange-100'}`}
              >
                <p className={`transition ${filterSubject === null ? 'font-bold' : 'font-base'}`} >ALL</p>
              </div>
              <div
                className={`mt-2 transition ${filterSubject === null ? 'text-orange-500 font-semibold' : 'text-orange-500'}`}
              >
                ALL
              </div>
            </button>

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
          <div className="text-center text-red-500">No subject data found</div>
        )}
      </section>

      <section className="bg-white mb-10 px-4 md:px-8 lg:px-16 space-y-12">
        {loadingTypes ? (
          <div className="text-center text-gray-500">Loading activity types...</div>
        ) : types.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <button
              onClick={() => setFilterType(null)}
              className={`text-sm md:text-base transition-all duration-200 ${filterType === null
                ? 'text-orange-500 border-b-2 border-orange-500 font-semibold'
                : 'text-gray-500 border-b-2 border-transparent hover:text-orange-500'
                }`}
            >
              All Types
            </button>

            {types.map((type) => (
              <button
                key={type.activity_type_id}
                onClick={() => handleTypeClick(type.activity_type_id)}
                className={`text-sm md:text-base transition-all duration-200 ${filterType === type.activity_type_id
                  ? 'text-orange-500 border-b-2 border-orange-500 font-semibold'
                  : 'text-gray-500 border-b-2 border-transparent hover:text-orange-500'
                  }`}
              >
                {type.activity_type_name}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center text-red-500">No activity types found</div>
        )}
      </section>


      <section className="bg-gray-200 py-4 px-10 md:py-10 md:px-12 lg:px-24 space-y-4 h-full">
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold">{filteredTitle}</h2>
          <div className="relative w-64">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search activity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 border border-gray-300 rounded-xl px-3 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>
        {loadingActivity ? (
          <div className="text-center text-gray-500">Loading activities...</div>
        ) : filteredActivity.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredActivity.map((activity: any) => (
              <HomepageActivityCard key={activity.activity_id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No matching activities found</div>
        )}
      </section>

      <Footer/>
    </div>
  );
}

export default Homepage;