import React, { useEffect, useState } from 'react'
import { ActivityField, getActivity } from '@/utils/api/activity';
import { SubjectField, getSubject } from '@/utils/api/subject';
import ActivityCard from './activityCard';
import SubjectCard from './subjectCard';
function Homepage() {
  const [sima, setSima] = useState<any>(null);
  const [activities, setActivities] = useState<ActivityField[]>([]);
  const [subjects, setSubjects] = useState<SubjectField[]>([]);
  const [filterSubject, setFilterActivity] = useState("");

  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     try {
  //       console.log("siam")

  //       const getuserFeild: any = {
  //         user_sys_id: 0
  //       }
  //       console.log("getuserFeild", getuserFeild)

  //       const user = await postUser(getuserFeild);
  //       console.log("user", user)
  //       // setSima(user);
  //     } catch (error) {
  //       console.error('Error fetching user:', error);
  //     }
  //   }, 5000); // 1000ms = 1 วินาที

  //   // Cleanup เมื่อ component ถูก unmount
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getActivity({ flag_valid: true });
        console.log(response);
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
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
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div className='bg-white'>
      <div className=" min-h-screen py-10 px-4 md:px-16 space-y-12">
        <section>
          <div className="flex justify-center gap-5 flex-wrap">
            {subjects.map((subject) => (
              <SubjectCard key={subject.subject_id} subject={subject} />
            ))}
          </div>
        </section>

        <section className= "bg-gray-100">{ /*"max-w-7xl mx-auto" */ }
          <h2 className="text-2xl font-bold mb-6">กิจกรรมทั้งหมด</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <ActivityCard key={activity.activity_id} activity={activity} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Homepage


// function Homepage() {
//   const [activities, setActivities] = useState<ActivityField[]>([]);
//   const [subjects, setSubjects] = useState<SubjectField[]>([]);
//   const [filterSubject, setFilterSubject] = useState<number | null>(null); // ใช้ Number แทน string

//   const [filteredActivities, setFilteredActivities] = useState<ActivityField[]>([]);



//   // Handle subject filter click
//   const handleSubjectClick = (subjectId: number) => {
//     if (subjectId === filterSubject) {
//       // Clear filter if clicked again
//       setFilterSubject(null);
//       setFilteredActivities(activities); // Show all activities
//     } else {
//       setFilterSubject(subjectId);
//       const filtered = activities.filter((activity) =>
//         activity.subject.data?.some(
//           (subject: any) => subject.subject_id === subjectId // กำหนดประเภทให้กับ subject
//         )
//       );
//       setFilteredActivities(filtered);
//     }
//   };

//   return (
//     <div className='bg-white'>
//       <div className="min-h-screen py-10 px-4 md:px-16 space-y-12">
//         <section>
//           <div className="flex justify-center gap-5 flex-wrap">
//             {subjects.map((subject) => (
//               <button
//                 key={subject.subject_id}
//                 onClick={() => handleSubjectClick(subject.subject_id)} // ส่ง subject_id ที่เป็น Number
//                 className={`px-4 py-2 rounded ${filterSubject === subject.subject_id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//               >
//                 {subject.subject_name}
//               </button>
//             ))}
//           </div>
//         </section>

//         <section className="bg-gray-100">
//           <h2 className="text-2xl font-bold mb-6">กิจกรรมทั้งหมด</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredActivities.map((activity) => (
//               <ActivityCard key={activity.activity_id} activity={activity} />
//             ))}
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

