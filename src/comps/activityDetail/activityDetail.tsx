import React, { useEffect, useState } from "react";
import { getActivity, ActivityField } from "@/utils/api/activity";

const ActivityDetail: React.FC = () => {
  const [activity, setActivity] = useState<ActivityField | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await getActivity({ activity_id: 10 });
        const result = response.data;
        if (Array.isArray(result) && result.length > 0) {
          setActivity(result[0]);
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  if (loading) return <p className="text-center">กำลังโหลดข้อมูล...</p>;
  if (!activity) return <p className="text-center text-red-500">ไม่พบกิจกรรม</p>;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto font-sans">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">{activity.title}</h1>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">โพสต์เมื่อ {new Date(activity.create_date).toLocaleDateString("th-TH", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit"
})}
          </p>
          <p className="text-sm text-gray-500 mb-4">สร้างโดย</p>
        </div>

        {activity.image_link && (
          <img src={activity.image_link} alt="Activity Banner" className="w-full h-64 object-cover" />
        )}

        <div className="p-6">
          <p className="text-gray-700 mb-6 text-base leading-relaxed">
            {activity.description}
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-blue-800 mb-2"> รายละเอียดกิจกรรม</h2>
            <ul className="list-disc ml-5 space-y-1 text-gray-700">
              {/* <li><strong>วันจัดกิจกรรม:</strong> {activity.start_date} - {activity.end_date}</li> */}
              <li><strong>จำนวนที่รับ:</strong> {activity.user_count ?? "ไม่ระบุ"}</li>
              <li><strong>ค่าใช้จ่าย:</strong> {activity.price ?? 0} บาท</li>
              <li><strong>สถานที่:</strong> {activity.location_name}</li>
              <li><strong>ระยะเวลาการเปิดรับสมัคร:</strong> 
              {new Date(activity.start_date).toLocaleDateString("th-TH", {
  year: "numeric",
  month: "long",
  day: "numeric"
})} - {new Date(activity.end_date).toLocaleDateString("th-TH", {
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
                <h2 className="text-xl font-semibold text-blue-800 mb-2"> ติดต่อสอบถาม</h2>
                <p className="ml-5 text-gray-700">{activity.contact}</p>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mb-6 ml-80">
            <a
              href="#"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
            >
              สมัครเข้าร่วมกิจกรรม
            </a>
            <a
              href="https://maps.google.com"
              target="_blank"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition"
            >
              ค้นหาสถานที่
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;

