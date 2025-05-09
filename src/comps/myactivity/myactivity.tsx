import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwtDecode from "@/utils/auth/jwt";
import { Plus } from "lucide-react";

interface ActivityField {
  id: string;
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
  participants?: string[]; // เพิ่ม field นี้เพื่อเก็บคนที่เข้าร่วม
  image?: string;
}

interface TokenPayload {
  user_sys_id: string;
}

const MyActivity = () => {
  const [activeTab, setActiveTab] = useState("task"); // "task" = เข้าร่วม, "create" = สร้าง
  const [activeCategory, setActiveCategory] = useState("today");
  const [activities, setActivities] = useState<ActivityField[]>([]);
  const router = useRouter();

  // ฟังก์ชันดึงกิจกรรมที่ฉันสร้าง
  const getMyCreatedActivities = (userId: string): ActivityField[] => {
    const stored = JSON.parse(localStorage.getItem("activities") || "[]");
    return stored.filter((act: ActivityField) => act.create_by === userId);
  };

  // ฟังก์ชันดึงกิจกรรมที่ฉันเข้าร่วม
  const getMyJoinedActivities = (userId: string): ActivityField[] => {
    const stored = JSON.parse(localStorage.getItem("activities") || "[]");
    return stored.filter((act: ActivityField) => act.participants?.includes(userId));
  };

  // โหลดข้อมูลเมื่อเข้ามาที่หน้านี้ หรือเมื่อ tab เปลี่ยน หรือเมื่อกลับมาจากหน้าอื่น
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("ไม่พบ token");
      return;
    }

    try {
      const decoded: TokenPayload = jwtDecode(token);
      const userId = decoded.user_sys_id;

      const data =
        activeTab === "create"
          ? getMyCreatedActivities(userId)
          : getMyJoinedActivities(userId);

      setActivities(data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการถอดรหัส token:", error);
    }
  }, [activeTab, router.asPath]);

  // นำทางไปยังหน้าสร้างกิจกรรม
  const goToCreateActivityPage = () => {
    router.push("/create_activity");
  };

  // ฟังก์ชันกรองและแสดงการ์ดกิจกรรม
  const renderActivityCards = () => {
    const today = new Date();

    const filteredActivities = activities.filter((activity) => {
      const start = new Date(activity.start_date);
      const end = new Date(activity.end_date);

      switch (activeCategory) {
        case "today":
          return (
            start.toDateString() === today.toDateString() ||
            (start <= today && end >= today)
          );
        case "upcoming":
          return start > today;
        case "overdue":
          return end < today;
        case "done":
          return activity.status.toLowerCase() === "done";
        default:
          return true;
      }
    });

    if (filteredActivities.length === 0) {
      return <div className="mt-4 text-gray-500">No activities in this category.</div>;
    }

    return (
      <div className="space-y-4 mt-4">
        {filteredActivities.map((activity, index) => (
          <Card key={index} activity={activity} />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-[#F5F9FF] min-h-screen relative">
      <h1 className="text-2xl font-bold mb-4">Activity</h1>

      {/* แท็บหลัก: Task และ Create Activity */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab("task")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition ${
            activeTab === "task" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Task
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition ${
            activeTab === "create" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Create Activity
        </button>
      </div>

      {/* แท็บย่อยของ Task: Today, Upcoming, Overdue, Done */}
      {activeTab === "task" && (
        <>
          <div className="flex gap-6 text-sm font-medium text-gray-600 border-b border-gray-300 pb-2">
            {["Today", "Upcoming", "Overdue", "Done"].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category.toLowerCase())}
                className={`pb-1 ${
                  activeCategory === category.toLowerCase()
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "hover:text-blue-500"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {renderActivityCards()}
        </>
      )}

      {/* แสดงข้อความถ้าไม่มีกิจกรรมในแท็บ Create Activity */}
      {activeTab === "create" && activities.length === 0 && (
        <div className="mt-10 text-center text-gray-500 text-sm">
          No activity created yet. Click + to create.
        </div>
      )}

      {/* แสดงรายการกิจกรรมที่สร้างในแท็บ Create Activity */}
      {activeTab === "create" && activities.length > 0 && (
        <div className="space-y-4 mt-4">
          {activities.map((activity, index) => (
            <Card key={index} activity={activity} />
          ))}
        </div>
      )}

      {/* ปุ่ม + สำหรับสร้างกิจกรรมใหม่ */}
      {activeTab === "create" && (
        <button
          onClick={goToCreateActivityPage}
          className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl absolute bottom-6 right-6 shadow-lg hover:bg-blue-600 transition"
        >
          {/* <Plus size={28} /> */}
        </button>
      )}
    </div>
  );
};

// คอมโพเนนต์การ์ดกิจกรรม
// const Card = ({ activity }: { activity: ActivityField }) => {
//   return (
//     <div className="bg-white rounded-xl p-4 shadow flex items-center gap-4">
//       <div className="w-1/3 bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold h-24">
//         {activity.image ? (
//           <img src={activity.image} alt="activity" className="object-cover w-full h-full rounded-lg" />
//         ) : (
//           <span>PR</span>
//         )}
//       </div>
//       <div className="w-2/3 pl-4">
//         <div className="font-bold text-sm text-blue-600 mb-1">{activity.title}</div>
//         <div className="text-gray-700 text-sm mb-2">{activity.description}</div>
//         <div className="text-gray-500 text-xs">
//           {activity.start_date} - {activity.end_date}
//         </div>
//       </div>
//     </div>
//   );
// };

export default MyActivity;

