import React, { useEffect, useState } from "react";
import { getActivity, ActivityField } from "@/utils/api/activity";
import Image from "next/image";
import Heart from "./Heart";
import { decodeToken } from '@/utils/auth/jwt';
import { getActivityAI } from "@/utils/api/AI"
import { useRouter } from 'next/router';

const Recommended: React.FC = () => {
  const [activities, setActivities] = useState<ActivityField[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const tokens = decodeToken();
  const router = useRouter();

  useEffect(() => {
    const fetchActivities = async () => {
      const tokens = decodeToken();
      if (tokens) {
        try {
          const currentActivityId = router.query.activity_id;
          const response = await getActivityAI({ flag_valid: true, user_sys_id: tokens.user_sys_id, limit: true });
          const result = response.data;
          if (Array.isArray(result)) {
            const filtered = result.filter(
              (activity: any) => Number(activity.activity_id) != Number(currentActivityId)
            );
            setActivities(filtered.slice(0, 10));
          }
        } catch (error) {
          console.error("Error fetching activities:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % activities.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [activities.length]);

  if (loading) return <p className="text-center">No Info Please Login!</p>;

  if (tokens) {
    return (
      <section className="overflow-hidden mb-24">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-bold mr-4 whitespace-nowrap text-blue-800">Activities you might like</h2>
          <div className="flex-grow h-0.5 bg-blue-200"></div>
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-4">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentSlide * 300}px)`,
            }}
          ></div>
          {activities
            .filter(activity => String(activity.activity_id) !== String(router.query.activity_id))
            .map((activity, index) => (
              <div
                key={index}
                className="min-w-[300px] max-w-[300px] border rounded-lg p-4 text-center relative shadow-md bg-white flex-shrink-0"
              >
                <Image
                  src={activity.image_link?.banner || "/default-banner.jpg"}
                  width={300}
                  height={160}
                  className="w-full h-40 object-cover rounded-md mb-2"
                  alt={activity.title}
                />
                <h3 className="text-sm font-bold">{activity.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{activity.location_name}</p>
                <div className="absolute top-2 right-2 flex items-center justify-center bg-gray-300 rounded-full">
                  <Heart activity_id={activity.activity_id} />
                </div>
                <button className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded mt-2">
                  View More
                </button>
              </div>
            ))}
        </div>
      </section>
    );
  }
};

export default Recommended;
