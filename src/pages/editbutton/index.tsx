import React from "react";
import { useRouter } from "next/router";

interface EditButtonProps {
  activityId: string | number; 
}

const EditButton: React.FC<EditButtonProps> = ({ activityId }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/activity_detail?activity_id=36&edit=true`);
    // router.push(`/activity_detail?activity_id=${activityId}&edit=true`);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-700 transition"
    >
      แก้ไขข้อมูล
    </button>
  );
};

export default EditButton;
