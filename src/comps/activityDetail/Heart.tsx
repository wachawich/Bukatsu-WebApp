import { useState, useEffect } from "react";
import { IconHeartFilled } from "@tabler/icons-react";
import { updateFav, getFav } from '@/utils/api/favorite';
import { decodeToken } from '@/utils/auth/jwt';

interface FavField {
  user_sys_id: number;
  activity_id: number;
  flag_valid?: boolean;
}

const getUserSysIdFromToken = (): number | null => {
  const user = decodeToken();
  return user?.user_sys_id || null;
};

function Heart({ activity_id }: FavField) {
  const [userSysId, setUserSysId] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // ตั้ง userSysId ตอนแรก
  useEffect(() => {
    const id = getUserSysIdFromToken();
    setUserSysId(id);
  }, []);

useEffect(() => {
  const fetchFavoriteStatus = async () => {
    if (!userSysId) return;

    try {
      const response = await getFav({ user_sys_id: userSysId, activity_id });
      const result = response?.data?.[0];
      setIsLiked(!!result && result.flag_valid === true);
    } catch (error) {
      console.error("Error fetching favorite status:", error);
    }
  };

  fetchFavoriteStatus();
}, [userSysId, activity_id]);


  const handleClick = async () => {
    if (!userSysId) return;

    setLoading(true);

    try {
      await updateFav({ user_sys_id: userSysId, activity_id, flag_valid: !isLiked });
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error updating favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        backgroundColor: isLiked ? "#FF6B6B" : "#D3D3D3",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        cursor: loading ? "wait" : "pointer",
        outline: "none",
        color: isLiked ? "white" : "gray",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
        transition: "background-color 0.3s ease, box-shadow 0.3s ease",
      }}
      aria-label={isLiked ? "Unlike" : "Like"}
    >
      <IconHeartFilled size={24} />
    </button>
  );
}

export default Heart;
