import React, { useEffect, useState } from 'react';
import { getActivity } from '@/utils/api/activity';
import { getFav } from '@/utils/api/favorite';
import { decodeToken } from '@/utils/auth/jwt';
import ActivityCard from '../homepage/activityCard';
import { ActivityField } from '@/utils/api/activity';

interface FavField {
  user_sys_id: number;
  activity_id: number;
  flag_valid?: boolean;
}

type ExtendedActivityField = ActivityField & {
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

function FavActivityPage() {
  const [userSysId, setUserSysId] = useState<number | null>(null);
  const [allActivities, setAllActivities] = useState<ExtendedActivityField[]>([]);
  const [favActivities, setFavActivities] = useState<ExtendedActivityField[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = getUserSysIdFromToken();
    setUserSysId(id);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userSysId) return;

      try {
        const [favRes, activityRes] = await Promise.all([
          getFav({ user_sys_id: userSysId }),
          getActivity({ flag_valid: true })
        ]);

        const favoriteIds = favRes.data
          ?.filter((fav: FavField) => fav.flag_valid)
          .map((fav: FavField) => fav.activity_id) || [];

        const matched = activityRes.data.filter((activity: ActivityField) =>
          favoriteIds.includes(activity.activity_id)
        );

        setAllActivities(activityRes.data);
        setFavActivities(matched);
      } catch (error) {
        console.error('Error fetching favorite activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userSysId]);

  return (
    <div className="bg-white max-w-4xl mx-auto my-10 px-4 py-10 relative border shadow-xl md:px-20 sm:px-8 sm:rounded-2xl h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Favorite Activity</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading your favorited activity...</p>
      ) : favActivities.length === 0 ? (
        <p className="text-center text-gray-500">No favorited activities found.</p>
      ) : (
        <div className="space-y-4">
          {favActivities.map((activity) => (
            <ActivityCard key={activity.activity_id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavActivityPage;
