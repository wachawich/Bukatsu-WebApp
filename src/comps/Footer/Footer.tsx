import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchDataApi } from "@/utils/callAPI";
import {
  IconMapPin,
  IconPhone,
  IconMail,
  IconBrandFacebook,
  IconBrandInstagram,
} from "@tabler/icons-react";

interface ClubSimple {
  club_id: string;
  club_name: string;
}

const Footer = () => {
  const [clubs, setClubs] = useState<ClubSimple[]>([]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetchDataApi("POST", "club.get", {});
        if (response && Array.isArray(response.data)) {
          const simpleClubs = response.data.map((item: any) => ({
            club_id: item.club_id,
            club_name: item.club_name,
          }));
          setClubs(simpleClubs);
        }
      } catch (error) {
        console.error("Error fetching clubs", error);
      }
    };

    fetchClubs();
  }, []);

  
  const clubsPerColumn = 3;
  const numberOfColumns = 4;
  const clubsToShow = clubs.slice(0, clubsPerColumn * numberOfColumns);
  const columns = Array.from({ length: numberOfColumns }, (_, i) =>
    clubsToShow.slice(i * clubsPerColumn, (i + 1) * clubsPerColumn)
  );

  return (
    <footer className="bg-orange-50 text-gray-800 border-t border-orange-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-20">
 
          <div className="w-full md:w-1/4 space-y-4">
            <Link href="/" className="inline-block">
              <h2 className="text-[#FD6A03] font-black text-2xl tracking-tight">BUKATSU</h2>
            </Link>
            <p className="text-gray-600 text-sm">
              Web-based application for activities and camps in KMUTT. Join clubs, discover events, and connect with fellow students.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-orange-500 hover:text-orange-700 transition-colors">
                <IconBrandFacebook size={20} />
              </a>
              <a href="#" className="text-orange-500 hover:text-orange-700 transition-colors">
                <IconBrandInstagram size={20} />
              </a>
            </div>
          </div>


          <div className="w-full md:w-1/2">
            <h3 className="font-bold text-lg border-b border-orange-200 pb-2 mb-4 text-center">CLUBS</h3>
            <div className="grid grid-cols-4 gap-x-8">
              {columns.map((col, idx) => (
                <ul key={idx} className="space-y-1">
                  {col.length > 0 ? (
                    col.map((club) => (
                      <li key={club.club_id} className="hover:text-[#FD6A03] transition-colors text-sm pl-6">
                        <Link href={`/club/${club.club_id}`} className="block">
                          {club.club_name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400 text-sm">Loading...</li>
                  )}
                </ul>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="w-full md:w-1/4 space-y-4">
            <h3 className="font-bold text-lg mb-4 border-b border-orange-200 pb-2">CONTACT US</h3>
            <div className="flex items-start space-x-3">
              <IconMapPin className="text-orange-500 mt-1" size={24} />
              <p className="text-gray-600 text-sm">
                126 Pracha Uthit Rd., Bang Mod, Thung Khru, Bangkok 10140, Thailand
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <IconPhone className="text-orange-500" size={18} />
              <p className="text-gray-600 text-sm">094-7767288</p>
            </div>
            <div className="flex items-center space-x-3">
              <IconMail className="text-orange-500" size={18} />
              <p className="text-gray-600 text-sm">info@bukatsu.kmutt.ac.th</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-orange-500 text-white py-3 px-4 text-center text-sm">
        BUKATSU - Connecting Students Through Activities
      </div>
    </footer>
  );
};

export default Footer;
