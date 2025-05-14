import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import jwtDecode from "@/utils/auth/jwt";
import { IconPlus } from "@tabler/icons-react";
import ActivityCard from "@/comps/homepage/activityCard";

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
  participants?: string[]; 
  image?: string;
}

interface TokenPayload {
  user_sys_id: string;
}

const MyActivity = () => {
  const [activeTab, setActiveTab] = useState("task"); 
  const [activeCategory, setActiveCategory] = useState("today");
  const [activities, setActivities] = useState<ActivityField[]>([]);
  const router = useRouter();
  
  useEffect(() => {
      const storedActivities = JSON.parse(localStorage.getItem("activities") || "[]");
      setActivities(storedActivities);
  }, [router.asPath]); 


  const getMyCreatedActivities = (userId: string): ActivityField[] => {
    const stored = JSON.parse(localStorage.getItem("activities") || "[]");
    return stored.filter((act: ActivityField) => act.create_by === userId);
  };


  const getMyJoinedActivities = (userId: string): ActivityField[] => {
    const stored = JSON.parse(localStorage.getItem("activities") || "[]");
    return stored.filter((act: ActivityField) => act.participants?.includes(userId));
  };


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

 
  const goToCreateActivityPage = () => {
    router.push("/create_activity");
  };

 
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
          <ActivityCard key={index} activity={activity} />
        ))}
      </div>
    );
  };
  

  return (
    <div className="p-6 bg-[#F5F9FF] min-h-screen relative">
      <h1 className="text-2xl font-bold mb-4">Activity</h1>

      
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


      {activeTab === "create" && activities.length === 0 && (
        <div className="mt-10 text-center text-gray-500 text-sm">
          No activity created yet. Click + to create.
        </div>
      )}

     
      {activeTab === "create" && activities.length > 0 && (
        <div className="space-y-4 mt-4">
          {activities.map((activity, index) => (
            <ActivityCard key={index} activity={activity} />
          ))}
        </div>
      )}

    
      {activeTab === "create" && (
        <button
          onClick={goToCreateActivityPage}
          className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl absolute bottom-6 right-6 shadow-lg hover:bg-blue-600 transition"
        >
          <IconPlus size={28} />
        </button>
      )}
    </div>
  );
};


export default MyActivity;

