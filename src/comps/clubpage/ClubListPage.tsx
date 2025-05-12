// pages/ClubListPage.tsx
import React, { useEffect, useState } from 'react';
import { fetchDataApi } from '@/utils/callAPI'; // ปรับ path ตามโครงสร้างโปรเจกต์ของคุณ
import {ClubItem,FormattedClubItem} from '@/utils/api/club';



const ClubListPage: React.FC = () => {
  const [clubItems, setClubItems] = useState<FormattedClubItem[]>([]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetchDataApi('POST', 'club.get', {}); // จาก http://localhost:8080/api/clubs
        const data = response.data as ClubItem[];

        const formatted = data.map((item) => ({
          id: item.club_id,
          title: item.club_name,
          detail: item.club_description,
          tag: new Date(item.club_timestamp).toLocaleDateString(),
          image: item.club_image_path,
          link: item.club_link,
        }));

        setClubItems(formatted);
      } catch (error) {
        console.error('Failed to fetch clubs:', error);
      }
    };

    fetchClubs();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-center mb-10">
        <div className="border-t border-gray-300 flex-grow"></div>
        <h1 className="text-4xl font-bold px-4 text-center">Club name</h1>
        <div className="border-t border-gray-300 flex-grow"></div>
      </div>

      <div className="flex flex-col gap-6">
        {clubItems.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="bg-fuchsia-500 text-white min-h-52 w-full md:w-80 flex items-center justify-center">
                {item.image ? (
                  <img
                    src={((item.image as { square?: string })?.square) || ''} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold">PR</span>
                )}
              </div>

              <div className="flex-1 p-6 relative">
                <div>
                  <h2 className="text-2xl font-bold">{item.title}</h2>
                  <p className="text-gray-700">{item.detail}</p>
                </div>

                <div className="mt-6">
                  <span className="bg-pink-100 text-pink-800 text-xs px-3 py-1 rounded-md">
                    {item.tag}
                  </span>
                </div>

                <div className="absolute bottom-6 right-6">
                  <a
                    href={`/clubdetail/${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-1 rounded-md"
                  >
                    ดูเพิ่มเติม
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClubListPage;
