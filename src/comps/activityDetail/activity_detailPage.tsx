import React, { useEffect, useState } from "react";
import { getActivity, ActivityField } from "@/utils/api/activity";
import { fetchDataApi } from "@/utils/callAPI";
import Image from 'next/image';
import Heart from "./Heart";
import { IconCameraPin } from '@tabler/icons-react'; 
import { useRouter } from "next/router";

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

type UserField = {
user_sys_id?: number;
  username?: string;
};

const getUser = async (input: UserField) => {
  const data = await fetchDataApi("POST", "users.get", {
    user_sys_id: input.user_sys_id || "",
    username: "",
    user_first_name: "",
    user_last_name: "",
    org_id: "",
    role_id: "",
    sex: "",
    phone: "",
    email: "",
  });

  return data;
};


const ActivityDetail: React.FC = () => {
  const [activity, setActivity] = useState<ExtendedActivityField | null>(null);
  const [creator, setCreator] = useState<UserField | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { activity_id } = router.query;

  useEffect(() => {
  const fetchActivity = async () => {
    if (!activity_id) return;

    try {
      const response = await getActivity({ activity_id: Number(activity_id) });
      const result = response.data;

      if (Array.isArray(result) && result.length > 0) {
        const activityData = result[0];
        setActivity(activityData);

        if (activityData.create_by) {
          const userRes = await getUser({ user_sys_id: activityData.create_by });
          if (Array.isArray(userRes?.data) && userRes.data.length > 0) {
            setCreator(userRes.data[0]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching activity or user:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchActivity();
}, [activity_id]);


  if (loading) return <p className="text-center">กำลังโหลดข้อมูล...</p>;
  if (!activity) return <p className="text-center text-red-500">ไม่พบกิจกรรม</p>;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto font-sans ">
      <div className="bg-white  rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 text-center">
        <div className="mb-4">
          <h1 className="text-2xl sm:text-4xl font-bold text-blue-900">{activity.title}</h1>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          โพสต์เมื่อ {new Date(activity.create_date).toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          })}
          {creator && (
            <span className="ml-2 text-gray-700">
              โดย {creator.username }
            </span>
          )}
        </p>
      </div>


        <Image 
          src="/test.jpg" 
          alt="test" 
          width={1000} 
          height={1000} 
          className="w-full h-[130%] rotate-0"
        />

        <div className="p-6 ">
          <div className="flex justify-end mb-4">
            <Heart />
          </div>
          <p className=" mb-6 text-base leading-relaxed">{activity.description}</p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">รายละเอียดกิจกรรม</h2>
            <ul className="list-disc ml-5 space-y-1 text-gray-700">
              <li><strong>จำนวนที่รับ:</strong> {activity.user_count ?? "ไม่ระบุ"}</li>
              <li><strong>ค่าใช้จ่าย:</strong> {activity.price ?? 0} บาท</li>
              <li><strong>สถานที่:</strong> {activity.location_name}</li>
              <li><strong>ระยะเวลาการเปิดรับสมัคร:</strong>{" "}
                {new Date(activity.start_date).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })} -{" "}
                {new Date(activity.end_date).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </li>
            </ul>

            {activity.remark && (
              <>
                <h2 className="text-xl font-semibold text-blue-800 mb-2">หมายเหตุ</h2>
                <p className="ml-5 text-gray-700">{activity.remark}</p>
              </>
            )}

            {activity.contact && (
              <>
                <h2 className="text-xl font-semibold text-blue-800 mb-2">ติดต่อสอบถาม</h2>
                <p className="ml-5 text-gray-700">{activity.contact}</p>
              </>
            )}


          </div>
          {((activity.activity_type_data?.length ?? 0) > 0 || (activity.activity_type_data?.length ?? 0)  > 0) && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 justify-center items-center">
                {activity.activity_type_data?.map((type: any) => (
                  <span
                    key={`type-${type.activity_type_id}`} 
                    className="bg-orange-200 text-orange-600 px-3 py-1 text-sm"
                  >
                    {type.activity_type_name}
                  </span>
                ))}
                {activity.activity_subject_data?.map((subject: any) => (
                  <span
                    key={`subject-${subject.subject_id}`}
                    className="bg-orange-200 text-orange-600 px-3 py-1 text-sm"
                  >
                    {subject.subject_name}
                  </span>
                ))}
              </div>
            </div>
          )}



          <p>location</p>
          
         

          <div className="flex flex-wrap justify-center items-center gap-4 ">
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md  transition">
           <IconCameraPin size={20} />
            <a>ค้นหาสถานที่</a>
          </button>

          <a
            href="#"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
          >
            สมัครเข้าร่วมกิจกรรม
          </a>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
