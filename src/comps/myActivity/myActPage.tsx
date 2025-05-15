import React, { useEffect, useState } from 'react';
import { ActivityField, getActivity, getMyActivity } from '@/utils/api/activity';
import ActivityCard from '../homepage/activityCard';
import { decodeToken } from '@/utils/auth/jwt';
import { useRouter } from "next/router";
import { IconPlus } from "@tabler/icons-react";

type ExtendedActivityField = ActivityField & {
    create_by?: string;
    activity_type_data?: {
        activity_type_id: number;
        activity_type_name: string;
    }[];
    activity_subject_data?: {
        subject_id: number;
        subject_name: string;
    }[];
};

const getUserSysIdFromToken = (): number | null => {
    const user = decodeToken();
    return user?.user_sys_id || null;
};

const MyActivityPage: React.FC = () => {
    const [createActivity, setCreateActivity] = useState<ExtendedActivityField[]>([]);
    const [myActivity, setMyActivity] = useState<ExtendedActivityField[]>([]);
    const [activeTab, setActiveTab] = useState<'myActivity' | 'createActivity'>('myActivity');
    const [activeCategory, setActiveCategory] = useState<"All" | "Today" | "Upcoming" | "Overdue">("All");
    const [loadingMyActivity, setLoadingMyActivity] = useState(true);
    const [loadingCreateActivity, setLoadingCreateActivity] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchMyActivity = async () => {
            const userSysId = getUserSysIdFromToken();
            if (!userSysId) return;

            try {
                const response = await getMyActivity({ user_sys_id: userSysId });
                setMyActivity(response.data);
            } catch (err) {
                console.error('Error fetching my activities:', err);
            } finally {
                setLoadingMyActivity(false);
            }
        };
        fetchMyActivity();
    }, []);

    useEffect(() => {
        const fetchCreateActivity = async () => {
            const userSysId = getUserSysIdFromToken(); // ✅ เพิ่มบรรทัดนี้

            if (!userSysId) return;

            try {
                const response = await getActivity({ flag_valid: true });
                const created = response.data.filter((activity: ActivityField) => activity.create_by === userSysId);
                setCreateActivity(created);
            } catch (err) {
                console.error('Error fetching Create activities:', err);
            } finally {
                setLoadingCreateActivity(false);
            }
        };
        fetchCreateActivity();
    }, []);



    const filterByCategory = (activities: ActivityField[]) => {
        const today = new Date();
        return activities.filter((activity) => {
            const start = new Date(activity.start_date);
            const end = new Date(activity.end_date);
            switch (activeCategory) {
                case "All":
                    return true;
                case "Today":
                    return start.toDateString() === today.toDateString() || (start <= today && end >= today);
                case "Upcoming":
                    return start > today;
                case "Overdue":
                    return end < today;
                default:
                    return true;
            }
        });
    };

    const goToCreateActivityPage = () => {
        router.push("/create_activity");
    };


    const displayedActivities = () => {
        const Activities = activeTab === "myActivity" ? myActivity : createActivity;
        const activities = filterByCategory(Activities);

        if ((activeTab === "myActivity" && loadingMyActivity) || (activeTab === "createActivity" && loadingCreateActivity)) {
            return (
                <div className="flex justify-center items-center h-40 text-sm md:text-base text-gray-500">
                    กำลังโหลดข้อมูล...
                </div>
            );
        }

        if (activities.length === 0) {
            return (
                <div className="flex justify-center items-center h-40 text-sm md:text-base text-gray-500">
                    ไม่มีข้อมูลกิจกรรมในหมวดนี้
                </div>
            );
        }

        return (
            <div className="space-y-4 mt-4">
                {activities.map((activity, index) => (
                    <ActivityCard
                        key={index}
                        activity={activity}
                        isEditable={activeTab === "createActivity"}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white max-w-4xl mx-auto my-6 px-4 py-10 relative border shadow-xl md:px-20 sm:px-8 sm:rounded-2xl">

            <h1 className="text-2xl font-bold mb-4">My Activity</h1>

            <div className="flex mb-4 rounded-full overflow-hidden border border-gray-300">
                <button
                    className={`w-1/2 px-6 py-2 text-xs md:text-base font-medium transition ${activeTab === "myActivity"
                        ? 'bg-orange-500 text-white'
                        : 'bg-black text-white hover:bg-gray-100'
                        }`}
                    onClick={() => setActiveTab("myActivity")}
                >
                    กิจกรรมที่เข้าร่วม
                </button>
                <button
                    className={`w-1/2 px-6 py-2 text-xs md:text-base font-medium transition ${activeTab === "createActivity"
                        ? 'bg-orange-500 text-white'
                        : 'bg-black text-white hover:bg-gray-100'
                        }`}
                    onClick={() => setActiveTab("createActivity")}
                >
                    กิจกรรมที่สร้าง
                </button>
            </div>


            <div className="bg-gray-200 rounded-md flex justify-between items-center h-10 px-4 text-xs md:text-base font-medium text-gray-600">
                {["All", "Today", "Upcoming", "Overdue"].map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category as any)}
                        className={`flex-1 h-full flex items-center justify-center border-b-2 transition ${activeCategory === category
                            ? 'text-orange-500 border-orange-500 font-bold'
                            : 'text-gray-500 border-transparent hover:text-orange-500'
                            }`}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>



            {displayedActivities()}

            {activeTab === "createActivity" && (
                <button
                    onClick={goToCreateActivityPage}
                    className="fixed bottom-6 right-6 bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-blue-600 transition z-50"
                >
                    <IconPlus size={28} />
                </button>
            )}

        </div>
    );
};

export default MyActivityPage;
