import React, { useEffect, useState } from 'react';
import { ActivityField } from "@/utils/api/activity";
import Image from "next/image";
import { useRouter } from "next/router";
import Heart from "../activityDetail/Heart";
import { updateJsonAI } from "@/utils/api/AI"
import { decodeToken } from "@/utils/auth/jwt";


interface ActivityCardProps {
  activity: ActivityField;
  isEditable?: boolean;
}

export default function ActivityCard({ activity, isEditable }: ActivityCardProps) {
  const router = useRouter();
  const [token, setToken] = useState<any>()

  useEffect(() => {
    const tokens = decodeToken();

    setToken(tokens)
    // if (token) {
    //   router.push("/home");
    // }
  }, []);

  const handleEditClick = () => {
    router.push(`/activity_detail?activity_id=${activity.activity_id}&edit=true`);
  };

  const handleViewDetail = () => {

    updateJsonAI({
      user_sys_id: token.user_sys_id,
      section: "click",
      activity_id: activity.activity_id
    })

    console.log("token.user_sys_id", token.user_sys_id)

    router.push(`/activity_detail?activity_id=${activity.activity_id}`);
  };

  return (
    <div className="relative flex border rounded-lg p-4 shadow hover:shadow-lg transition-all bg-white gap-4 w-full h-full min-h-60 max-h-64">
      <div className="relative w-2/5">
        <Image
          src={activity.image_link?.banner || "/default-banner.jpg"}
          alt="Banner Image"
          width={1000}
          height={400}
          className="object-cover rounded-md w-full h-full"
        />
        <div className="absolute top-2 right-2 bg-gray-300 rounded-full z-10">
          <Heart activity_id={activity.activity_id} />
        </div>
      </div>
      <div className="flex flex-col justify-between flex-1">
        <div className="m-1">
          <h2 className="text-lg sm:text-xl font-bold">{activity.title}</h2>

          <div className="flex flex-wrap gap-1.5">
            {activity.activity_type_data?.map((type) => (
              <span
                key={`type-${type.activity_type_id}`}
                className="bg-orange-200 text-orange-600 px-2 py-1 text-[11px] rounded-sm text-center"
              >
                {type.activity_type_name}
              </span>
            ))}
            {activity.activity_subject_data?.map((subject) => (
              <span
                key={`subject-${subject.subject_id}`}
                className="bg-orange-200 text-orange-600 px-2 py-1 text-[11px] rounded-sm text-center"
              >
                {subject.subject_name}
              </span>
            ))}
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 sm:line-clamp-3 m-2 ml-1">
            {activity.description}
          </p>
        </div>

        <div className="mt-2 self-end flex gap-2">
          <button
            onClick={handleViewDetail}
            className="text-xs md:text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded"
          >
            View more
          </button>
          {/* // สำหรับหน้าแก้ไข */}
          {isEditable && (
            <button
              onClick={handleEditClick}
              className="text-xs md:text-sm bg-gray-400 hover:bg-blue-600 text-white px-4 py-1 rounded flex items-center gap-1"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
