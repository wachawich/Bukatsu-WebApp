import React, { useEffect, useState } from "react";
import { getActivity, ActivityField, updateActivity, deleteActivity } from "@/utils/api/activity";
import { fetchDataApi } from "@/utils/callAPI";
import Image from 'next/image';
import Heart from "./Heart";
import { IconCameraPin, IconClock } from '@tabler/icons-react';
import { useRouter } from "next/router";
import { Calendar, MapPin, Users, CreditCard, MessageSquare, Info } from "lucide-react";

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

import ActivityRegisterModal from '@/comps/activityDetail/ActivityRegisterModal';


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

  const [showModal, setShowModal] = useState(false);


  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

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

  const handleDelete = async () => {
    if (!activity?.activity_id) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this activity?");
    if (!confirmDelete) return;

    try {
      await deleteActivity({ activity_id: activity.activity_id });
      alert("Activity deleted successfully");
      router.push("/myac");
    } catch (err) {
      console.error("Error deleting activity:", err);
      alert("An error occurred while deleting the activity");
    }
  };


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

  const openGoogleMaps = (activity: any) => {
    if (activity) {
      const url = `https://www.google.com/maps?q=${activity.lat},${activity.long}`;
      window.open(url, '_blank');
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
          {((activity.activity_type_data?.length ?? 0) > 0 || (activity.activity_type_data?.length ?? 0) > 0) && (
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
            <IconClock size={18} className="text-orange-500 mt-2 mb-4" />
            <p className="text-sm text-gray-500 mt-2 mb-4">
              โพสต์เมื่อ {new Date(activity.create_date).toLocaleDateString("th-TH", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              })}
              {creator && (
                <span className="ml-6 text-gray-500">
                  โดย {creator.username}
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
              <p style={{ textIndent: "2rem" }} className="mb-2 p-7 text-base leading-relaxed text-md text-center">
                {activity.description}
              </p>
            )}
          </div>

          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="border-b border-gray-200 px-8 py-6">
                <h2 className="text-2xl font-medium text-gray-800">รายละเอียดกิจกรรม</h2>
                <p className="text-gray-500 mt-1 text-sm">ข้อมูลสำคัญที่ผู้เข้าร่วมควรทราบ</p>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-50 p-3 rounded-full">
                        <Users className="text-gray-600" size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">จำนวนที่รับ</h3>
                        {editing ? (
                          <input
                            type="number"
                            value={formData.user_count || ""}
                            onChange={(e) => setFormData({ ...formData, user_count: e.target.value })}
                            className="border border-gray-200 p-2 rounded w-full mt-1"
                          />
                        ) : (
                          <p className="text-lg font-medium text-gray-800">{activity.user_count} คน</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-50 p-3 rounded-full">
                        <CreditCard className="text-gray-600" size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">ค่าใช้จ่าย</h3>
                        {editing ? (
                          <input
                            type="number"
                            value={formData.price || ""}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="border border-gray-200 p-2 rounded w-full mt-1"
                          />
                        ) : (
                          <p className="text-lg font-medium text-gray-800">{activity.price} บาท</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-50 p-3 rounded-full">
                        <MapPin className="text-gray-600" size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">สถานที่</h3>
                        {editing ? (
                          <select
                            value={formData.location_id || ""}
                            onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                            className="border border-gray-200 p-2 rounded w-full mt-1"
                          >
                            {locations.map((loc) => (
                              <option key={loc.location_id} value={loc.location_id}>
                                {loc.location_name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-gray-800">{activity.location_name}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-50 p-3 rounded-full">
                        <Calendar className="text-gray-600" size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">ระยะเวลา</h3>
                        {editing ? (
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <input
                              type="date"
                              value={formData.start_date || ""}
                              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                              className="border border-gray-200 p-2 rounded"
                            />
                            <input
                              type="date"
                              value={formData.end_date || ""}
                              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                              className="border border-gray-200 p-2 rounded"
                            />
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-800">
                              {formatDate(activity.start_date)} - {formatDate(activity.end_date)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              ({Math.ceil((new Date(activity.end_date) - new Date(activity.start_date)) / (1000 * 60 * 60 * 24))} วัน)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-50 p-3 rounded-full">
                        <MessageSquare className="text-gray-600" size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">ติดต่อสอบถาม</h3>
                        {editing ? (
                          <textarea
                            value={formData.contact || ""}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            className="border border-gray-200 p-2 rounded w-full mt-1 h-20"
                          />
                        ) : (
                          <p className="text-gray-700">{activity.contact}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remarks - Full Width */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-50 p-3 rounded-full">
                      <Info className="text-gray-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">หมายเหตุ</h3>
                      {editing ? (
                        <textarea
                          value={formData.remark || ""}
                          onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                          className="border border-gray-200 p-2 rounded w-full mt-1 h-32"
                        />
                      ) : (
                        <div className="bg-gray-50 border-l-2 border-gray-300 p-4 rounded mt-2">
                          <p className="text-gray-700">{activity.remark}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end space-x-4">
                  {editing ? (
                    <>
                      <button
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                        onClick={() => setEditing(false)}
                      >
                        ยกเลิก
                      </button>
                      <button
                        className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
                        onClick={() => {
                          setActivity({ ...formData, location_name: locations.find(l => l.location_id === formData.location_id)?.location_name });
                          setEditing(false);
                        }}
                      >
                        บันทึก
                      </button>
                    </>
                  ) : (
                    <button
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                      onClick={() => setEditing(true)}
                    >
                      แก้ไข
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {!editing && (
              <div className="flex flex-wrap justify-center items-center gap-4 ">
                <button className="font-bold flex items-center gap-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-500 hover:to-orange-800 text-white px-4 py-2 rounded-xl transition text-lg"
                  onClick={() => openGoogleMaps(activity)}
                >
                  <IconCameraPin size={20} />
                  <span>Find Location</span>
                </button>

                {activity.activity_json_form && (
                  <button
                    onClick={() => {
                      setShowModal(true)
                      // if (!isSubmitted) {
                      //   router.push(`/activity_register?activity_id=${activity_id}`);
                      // }
                    }}
                    className={`font-bold flex items-center px-8 py-2 rounded-xl shadow transition text-white text-lg 
                        ${isSubmitted
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    disabled={isSubmitted}
                  >
                    <MapPin size={20} className="mr-3" />
                    {isSubmitted ? "Joined" : "Join Activity"}
                  </button>
                )}
              </div>
            )}

            {editing && (
              <div className="flex justify-center mt-4 space-x-4">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

      {activity.activity_id && showModal && (
        <ActivityRegisterModal
          activityId={activity.activity_id}
          onClose={() => setShowModal(false)}
          onSuccess={() => console.log("Success register")}
        />
      )}
    </div>
  );
};

export default ActivityDetail;
