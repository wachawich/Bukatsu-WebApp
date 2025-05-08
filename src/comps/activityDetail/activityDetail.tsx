import React, { useState } from "react";
import { Heart } from "lucide-react"; // ใช้ icon library (เช่น lucide-react หรือ react-icons)

const mockData = {
  eventTitle: "OPEN HOUSE : LAW ABAC OPEN HOUSE 2025",
  datePosted: "14/03/2025",
  eventDate: "Friday, March 28th, 2025",
  location: "Assumption University, Hua Mak Campus",
  preRegisterLink: "https://forms.gle/kcgzjcVCW7fhP66Q6",
  mapLink: "https://maps.app.goo.gl/6GCrtXhcka42hDGo7",
  registrationDeadline: "27 มีนาคม 2025",
  time: "09.00 น. - 15.00 น.",
  contacts: [
    { name: "Ploy", phone: "0614326886" },
    { name: "Fern", phone: "0987491098" },
    { name: "Poon", phone: "0909865808" },
    { name: "Beam", phone: "0610538266" },
  ],
  socialMedia: {
    facebook: "https://www.facebook.com/AULawSchool",
    instagram: "a.u.schooloflaw",
    line: "https://lin.ee/tig2/bXHR2dxiIiqMZiB01M7U4gaa27F568WYEFtMcQ",
    twitter: "LAWABAC",
  },
  notes: [
    "มีเกียรติบัตรมอบให้สำหรับผู้เข้าร่วมกิจกรรม!",
    "ไม่มีค่าใช้จ่าย",
  ],
  image: "/11.png",
};

const OpenHousePage = () => {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto font-sans">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <img
          src={mockData.image}
          alt="Open House Banner"
          className="w-full h-64 object-cover"
        />

        <div className="p-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">{mockData.eventTitle}</h1>
            <button onClick={() => setIsFavorited(!isFavorited)} aria-label="Favorite">
              <Heart
                size={28}
                className={`transition-colors ${isFavorited ? "text-red-500 fill-red-500" : "text-gray-400"}`}
              />
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-4">โพสต์เมื่อ {mockData.datePosted}</p>

          <div className="flex flex-wrap gap-3 mb-6">
            <a
              href={mockData.preRegisterLink}
              target="_blank"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
            >
              สมัครเข้าร่วมกิจกรรม
            </a>
            <a
              href={mockData.mapLink}
              target="_blank"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition"
            >
              ค้นหาสถานที่
            </a>
          </div>

          <p className="text-gray-700 mb-6 text-base leading-relaxed">
            ✨ ขอเชิญนักเรียนและผู้ปกครองเข้าร่วมกิจกรรม Open House คณะนิติศาสตร์
            มหาวิทยาลัยอัสสัมชัญ พบกับกิจกรรม Workshop ที่จะช่วยให้คุณเข้าใจสิทธิ
            ขั้นพื้นฐานเกี่ยวกับกฎหมาย และเปิดโลกให้รู้จักการศึกษาด้านนิติศาสตร์
          </p>

          {/* รายละเอียดกิจกรรม */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">📌 รายละเอียดกิจกรรม</h2>
            <ul className="list-disc ml-5 space-y-1 text-gray-700">
              <li><strong>วันจัดกิจกรรม:</strong> {mockData.eventDate}</li>
              <li><strong>เวลา:</strong> {mockData.time}</li>
              <li><strong>สถานที่:</strong> {mockData.location}</li>
              <li>
                <strong>แผนที่:</strong>{" "}
                <a href={mockData.mapLink} className="text-blue-600 underline" target="_blank">
                  คลิกดูแผนที่
                </a>
              </li>
              <li>
                <strong>ลงทะเบียนล่วงหน้า:</strong>{" "}
                <a href={mockData.preRegisterLink} className="text-blue-600 underline" target="_blank">
                  คลิกลงทะเบียน
                </a>
              </li>
              <li><strong>ปิดรับสมัคร:</strong> {mockData.registrationDeadline}</li>
            </ul>
          </div>

          {/* ติดต่อสอบถาม */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">📞 ติดต่อสอบถาม</h2>
            <ul className="list-disc ml-5 space-y-1 text-gray-700">
              {mockData.contacts.map((contact, idx) => (
                <li key={idx}>
                  {contact.name}: {contact.phone}
                </li>
              ))}
            </ul>
          </div>

          {/* หมายเหตุ */}
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-green-800 mb-2">📝 หมายเหตุ</h2>
            <ul className="list-disc ml-5 space-y-1 text-gray-700">
              {mockData.notes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>

          {/* โซเชียลมีเดีย */}
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-purple-800 mb-2">🌐 โซเชียลมีเดีย</h2>
            <ul className="list-disc ml-5 space-y-1 text-gray-700">
              <li>
                <a href={mockData.socialMedia.facebook} className="text-blue-700 underline" target="_blank">
                  Facebook
                </a>
              </li>
              <li>Instagram: {mockData.socialMedia.instagram}</li>
              <li>
                <a href={mockData.socialMedia.line} className="text-green-700 underline" target="_blank">
                  Line
                </a>
              </li>
              <li>Twitter: {mockData.socialMedia.twitter}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenHousePage;
