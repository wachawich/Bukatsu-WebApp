import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface ActivityField {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  contact: string;
  price: number;
  location_id?: number;
  user_count: number;
  create_by: string;
  image?: string;
}

function AllPostPage() {
  const [activities, setActivities] = useState<ActivityField[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedActivities = JSON.parse(localStorage.getItem("activities") || "[]");
    setActivities(storedActivities);
  }, []);

  const goToDetail = (activity: ActivityField) => {
    router.push({
      pathname: "/activity-detail",
      query: { activity: JSON.stringify(activity) },
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f9f9ff] px-4 md:px-32 py-10">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 md:p-20">
        <h1 className="text-2xl font-cherry text-center mb-6">All Posts</h1>
        {activities.length === 0 ? (
          <p className="text-center text-gray-600">No activities available.</p>
        ) : (
          activities.map((activity, index) => (
            <div key={index} className="flex border rounded-lg overflow-hidden mb-6 bg-white shadow-lg">
              {/* รูปภาพ */}
              <div className="w-1/3 bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                {activity.image ? (
                  <img src={activity.image} alt="activity" className="object-cover w-full h-full" />
                ) : (
                  <span>PR</span>
                )}
              </div>

              {/* ข้อมูลกิจกรรม */}
              <div className="w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold">{activity.title}</h2>
                  <p className="text-gray-600">{activity.description}</p>
                </div>

                {/* ปุ่มดูเพิ่มเติม */}
                <div className="flex items-center justify-between mt-4">
                  <span className="bg-red-100 text-red-500 px-2 py-1 rounded text-xs">ใหม่</span>
                  <button
                    onClick={() => goToDetail(activity)}
                    className="bg-orange-500 hover:bg-orange-700 text-white px-4 py-2 rounded-full text-sm"
                  >
                    ดูเพิ่มเติม
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AllPostPage;
// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import Link from "next/link";

// interface ActivityField {
//   title: string;
//   description: string;
//   start_date: string;
//   end_date: string;
//   status: string;
//   contact: string;
//   price: number;
//   location_id?: number;
//   user_count: number;
//   create_by: string;
//   image?: string;
// }

// function AllPostPage() {
//   const [activities, setActivities] = useState<ActivityField[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     const storedActivities = JSON.parse(localStorage.getItem("activities") || "[]");
//     setActivities(storedActivities);
//   }, []);

//   const goToDetail = (activity: ActivityField) => {
//     router.push({
//       pathname: "/activity-detail",
//       query: { activity: JSON.stringify(activity) },
//     });
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center bg-[#f9f9ff] px-4 md:px-32 py-10">
//       <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 md:p-20">
//         <h1 className="text-2xl font-cherry text-center mb-6">All Posts</h1>
//         {activities.length === 0 ? (
//           <p className="text-center text-gray-600">No activities available.</p>
//         ) : (
//           activities.map((activity, index) => (
//             <div key={index} className="flex border rounded-lg overflow-hidden mb-6 bg-white shadow-lg">
//               {/* รูปภาพ */}
//               <div className="w-1/3 bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
//                 {activity.image ? (
//                   <img src={activity.image} alt="activity" className="object-cover w-full h-full" />
//                 ) : (
//                   <span>PR</span>
//                 )}
//               </div>

//               {/* ข้อมูลกิจกรรม */}
//               <div className="w-2/3 p-4 flex flex-col justify-between">
//                 <div>
//                   <h2 className="text-xl font-bold">{activity.title}</h2>
//                   <p className="text-gray-600">{activity.description}</p>
//                 </div>

//                 {/* ปุ่มดูเพิ่มเติม */}
//                 <div className="flex items-center justify-between mt-4">
//                   <span className="bg-red-100 text-red-500 px-2 py-1 rounded text-xs">ใหม่</span>
//                   <button
//                     onClick={() => goToDetail(activity)}
//                     className="bg-orange-500 hover:bg-orange-700 text-white px-4 py-2 rounded-full text-sm"
//                   >
//                     ดูเพิ่มเติม
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default AllPostPage;
