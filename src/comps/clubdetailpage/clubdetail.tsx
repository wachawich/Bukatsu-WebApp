import React, { useEffect, useState } from 'react';
import ClubDetailCard from './ClubDetailCard';
import { fetchDataApi } from '@/utils/callAPI';
import {ClubItem, getClub, ClubdetailProps } from '@/utils/api/club';


const Clubdetail: React.FC<ClubdetailProps> = ({ clubId }) => {
  const [clubData, setClubData] = useState<ClubItem | null>(null);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await getClub(clubId);  
        setClubData(response.data[0] as ClubItem);
      } catch (error) {
        console.error('Error fetching club:', error);
      }
    };

    if (clubId) {
      fetchClub();
    }
  }, [clubId]);

  if (!clubData) {
    return <div className="text-black p-10">กำลังโหลดข้อมูลชมรม...</div>;
  }

  return (
    <div className="mt-20 text-black">
      <ClubDetailCard club={clubData} />
    </div>
  );
};

export default Clubdetail;