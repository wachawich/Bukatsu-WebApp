import React, { useEffect, useState } from "react";
import { getActivity, ActivityField ,updateActivity} from "@/utils/api/activity";
import { fetchDataApi } from "@/utils/callAPI";
import Image from 'next/image';
import Heart from "./Heart";
import { IconCameraPin, IconClock } from '@tabler/icons-react'; 
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
  const { activity_id, submitted, edit } = router.query;
  const isSubmitted = submitted === "true"; 
  const [editing, setEditing] = useState(false);
   const [formData, setFormData] = useState<ActivityField | null>(null);
  const [locations, setLocations] = useState<{ location_id: string; location_name: string }[]>([]);
  const isEditMode = edit === "true";
  
  useEffect(() => {
      if (edit === "true") {
        setEditing(true);
      } else {
        setEditing(false);
      }
    }, [edit]);
    useEffect(() => {
    const fetchActivity = async () => {
      if (!activity_id) return;

    try {
      const response = await getActivity({ activity_id: Number(activity_id) });
      const result = response.data;

        if (Array.isArray(result) && result.length > 0) {
            const activityData = result[0];
            setActivity(activityData);
            setFormData(activityData);


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

  useEffect(() => {
      const fetchLocations = async () => {
        const res = await fetchDataApi("POST", "location.get", {});
        if (Array.isArray(res?.data)) {
          setLocations(res.data);
        }
      };
      fetchLocations();
    }, []);

    const handleSave = async () => {
    if (!formData) return;
      try {
        await updateActivity({ ...formData, activity_id: activity?.activity_id });
        alert("Update successful");
        setEditing(false);
        router.replace(`/activity_detail?activity_id=${activity?.activity_id}`);
      } catch (err) {
        console.error("Error updating activity:", err);
        alert("An error occurred while updating the activity");
      }
  };


  if (loading) return <p className="text-center">Loading data...</p>;
  if (!activity || !formData) return <p className="text-center text-red-500">Activity not found</p>;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto ">
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
      
        <div className="text-center mt-8 ">
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

          <div >
           <h1 className=" text-2xl sm:text-5xl font-bold text-blue-900">
            {editing ? (
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="border p-2 rounded w-full"
              />
            ) : (
              activity.title
            )}
          </h1>
          </div>
          <div className="flex items-center justify-center text-gray-500 text-sm gap-2">
            <IconClock  size={18} className="text-orange-500 mt-2 mb-4" />
            <p className="text-sm text-gray-500 mt-2 mb-4">
              โพสต์เมื่อ {new Date(activity.create_date).toLocaleDateString("th-TH", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              })}
              {creator && (
                <span className="ml-6 text-gray-500">
                  โดย {creator.username }
                </span>
              )}
            </p>
          </div>
        </div>

          
        
 
        <div className="p-4">
          <div>
            
            {editing ? (
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border p-2 rounded w-full h-full"
              />
            ) : (
              <p style={{ textIndent: "2rem" }} className="mb-2 p-7 text-base leading-relaxed">
                {activity.description}
              </p>
            )}
          </div>

          <div className="p-6"> 
          <div className="bg-blue-50 border-l-4 border-blue-400 p-8 mb-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-blue-800 mb-2">รายละเอียดกิจกรรม</h2>
            <ul className="list-disc ml-10 space-y-1 text-gray-700 text-lg">
              <ul>
                <strong>จำนวนที่รับ:</strong>{" "}
                {editing ? (
                  <input
                    type="number"
                    value={formData.user_count || ""}
                    onChange={(e) => setFormData({ ...formData, user_count: e.target.value })}
                    className="border p-1 rounded w-32"
                  />
                ) : (
                  activity.user_count ?? "ไม่ระบุ"
                )}
              </ul>
              <ul>
                <strong>ค่าใช้จ่าย:</strong>{" "}
                {editing ? (
                  <input
                    type="number"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="border p-1 rounded w-32"
                  />
                ) : (
                  `${activity.price ?? 0} บาท`
                )}
              </ul>
              <ul>
                <strong>สถานที่:</strong>{" "}
                {editing ? (
                  <select
                    value={formData.location_id || ""}
                    onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                    className="border p-2 rounded"
                  >
                    {locations.map((loc) => (
                      <option key={loc.location_id} value={loc.location_id}>
                        {loc.location_name}
                      </option>
                    ))}
                  </select>
                ) : (
                  activity.location_name
                )}
              </ul>
              <ul>
                <strong>ระยะเวลา:</strong>{" "}
                {editing ? (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={formData.start_date || ""}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="border p-1 rounded"
                    />
                    ถึง
                    <input
                      type="date"
                      value={formData.end_date || ""}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="border p-1 rounded"
                    />
                  </div>
                ) : (
                  `${new Date(activity.start_date).toLocaleDateString("th-TH")} - ${new Date(activity.end_date).toLocaleDateString("th-TH")}`
                )}
              </ul>
            </ul>

            <div className="mt-4 ">
              <h2 className="text-2xl font-semibold text-blue-800 mb-2">หมายเหตุ</h2>
              {editing ? (
                <textarea
                  value={formData.remark || ""}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                  className="border p-2 rounded w-full"
                />
              ) : (
                <div className="ml-10 text-lg">
                <p>{activity.remark}</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-semibold text-blue-800 mb-2">ติดต่อสอบถาม</h2>
              {editing ? (
                <input
                  type="text"
                  value={formData.contact || ""}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="border p-2 rounded w-full ml-10"
                />
              ) : (
                <div className="ml-10 text-lg">
                <p>{activity.contact}</p>
                </div>
              )}
            </div>
          </div>
          </div>  

        <div className="p-6">
            <p>location</p>
            {!editing && (
              <div className="flex flex-wrap justify-center items-center gap-4 ">
                <button className="flex items-center gap-4 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition text-lg">
                  <IconCameraPin size={20} />
                  <a>Find Location</a>
                </button>
                {activity.activity_json_form && (
                  <a
                    href={`/activity_register?activity_id=${activity_id}`}
                    className={`px-4 py-2 rounded-md shadow transition text-white text-lg ${
                      isSubmitted ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {isSubmitted ? "Joined" : "Join Activity"}
                  </a>
                )}
              </div>
            )}

            {editing && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            )}
          </div>

        </div>
       
      </div>
    </div>
  );
};

export default ActivityDetail;
