import React, { useEffect, useState } from "react";
import { getActivity, ActivityField } from "@/utils/api/activity";
import { fetchDataApi } from "@/utils/callAPI";
import Image from 'next/image';
import Heart from "./Heart";
import { IconCameraPin, IconClock } from '@tabler/icons-react'; 
import { useRouter } from "next/router";
import { Dialog } from '@headlessui/react';
import FormPreview from '@/comps/form/form-builder/form-preview';

type ExtendedActivityField = ActivityField & {
  activity_type_data?: {
    activity_type_id: number;
    activity_type_name: string;
  }[];
  activity_subject_data?: {
    subject_id: number;
    subject_name: string;
  }[];
  image_url?: string;
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
  const { activity_id, submitted } = router.query; 
  const isSubmitted = submitted === "true"; 

  // const [isFormOpen, setIsFormOpen] = useState(false); 
  // const [isSubmitted, setIsSubmitted] = useState(false);
  

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
      <div className="bg-white  rounded-xl shadow-lg overflow-hidden ">
        <div className="relative">
          <div className="absolute top-2 right-2 rounded-full p-2 shadow-md">
              <Heart />
          </div>
          <Image 
              src={activity.image_link?.banner || "/default-banner.jpg"} 
              alt="Banner Image" 
              width={1000} 
              height={400} 
              className="w-full h-auto  "
            />
        </div>
      
        <div className="text-center mt-6">
          {((activity.activity_type_data?.length ?? 0) > 0 || (activity.activity_type_data?.length ?? 0)  > 0) && (
              <div className="mb-4">
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
        
          <h1 className="text-2xl sm:text-4xl font-bold text-blue-900">{activity.title}</h1>
          <div className="flex items-center justify-center text-gray-500 text-sm gap-2">
            <IconClock  size={18} className="text-orange-500 mt-3 mb-4" />
            <p className="text-sm text-gray-500 mt-2 mb-4">
              โพสต์เมื่อ {new Date(activity.create_date).toLocaleDateString("th-TH", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              })}
              {creator && (
                <span className="ml-6 text-gray-700">
                  โดย {creator.username }
                </span>
              )}
            </p>
          </div>
        </div>

          
        
 
        <div className="p-4">
         <p style={{ textIndent: "2rem" }} className="mb-2 p-7 text-base leading-relaxed">
          {activity.description}
        </p>

          <div className="p-6"> 
          <div className="bg-blue-50 border-l-4 border-blue-400 p-8 mb-6 rounded-lg shadow-sm">
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
          </div>  


          <p>location</p>
          
         

          <div className="flex flex-wrap justify-center items-center gap-4 ">
          <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md  transition">
           <IconCameraPin size={20} />
            <a>ค้นหาสถานที่</a>
          </button>

          {activity.activity_json_form && (
              // <button
              //   onClick={() => setIsFormOpen(true)}
              //   className={`px-4 py-2 rounded-md shadow transition text-white ${
              //     isSubmitted ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              //   }`}
              //   disabled={isSubmitted}
              // >
              //   {isSubmitted ? "สมัครเรียบร้อยแล้ว" : "สมัครเข้าร่วมกิจกรรม"}
              // </button>
              <a 
            href={`/activity_register?activity_id=${activity_id}`} 
            className={`px-4 py-2 rounded-md shadow transition text-white ${
                isSubmitted ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
            {isSubmitted ? "สมัครเรียบร้อยแล้ว" : "สมัครเข้าร่วมกิจกรรม"}
        </a>
            )}
          </div>
        </div>
      </div>

      {/* <Dialog open={isFormOpen} onClose={() => setIsFormOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded bg-white p-6">
            <Dialog.Title className="text-xl font-bold mb-4">สมัครเข้าร่วมกิจกรรม</Dialog.Title>

            {activity.activity_json_form && (
              <FormPreview
                form={activity.activity_json_form}
                onSubmitSuccess={() => {
                  setIsSubmitted(true); 
                  setIsFormOpen(false); 
                }}
              />
            )}

            <div className="mt-4 text-right">
              <button onClick={() => setIsFormOpen(false)} className="text-sm text-gray-600 hover:text-gray-800">
                ปิด
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog> */}
    </div>
  );
};

export default ActivityDetail;
