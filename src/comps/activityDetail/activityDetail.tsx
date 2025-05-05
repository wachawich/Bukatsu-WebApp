import React from "react";

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
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">{mockData.eventTitle}</h1>
      <p className="text-center text-gray-500 mb-4">โพสต์เมื่อ {mockData.datePosted}</p>

      <img src={mockData.image} alt="Open House Banner" className="w-full rounded-lg shadow mb-6" />

      <div className="space-y-4">
        <p>✨ ขอเชิญนักเรียนและผู้ปกครองเข้าร่วมกิจกรรม Open House คณะนิติศาสตร์ มหาวิทยาลัยอัสสัมชัญ 
          พบกับกิจกรรม Workshop ที่จะช่วยให้คุณเข้าใจสิทธิขั้นพื้นฐานเกี่ยวกับกฎหมาย และเปิดโลกให้รู้จักการศึกษาด้านนิติศาสตร์
        </p>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">รายละเอียดกิจกรรม</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li><strong>วันจัดกิจกรรม:</strong> {mockData.eventDate}</li>
            <li><strong>เวลา:</strong> {mockData.time}</li>
            <li><strong>สถานที่:</strong> {mockData.location}</li>
            <li><strong>แผนที่:</strong> <a href={mockData.mapLink} className="text-blue-600 underline" target="_blank">คลิกดูแผนที่</a></li>
            <li><strong>ลงทะเบียนล่วงหน้า:</strong> <a href={mockData.preRegisterLink} className="text-blue-600 underline" target="_blank">คลิกลงทะเบียน</a></li>
          </ul>
        </div>

        <div className="bg-yellow-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">ติดต่อสอบถาม</h2>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            {mockData.contacts.map((contact, index) => (
              <li key={index}>{contact.name}: {contact.phone}</li>
            ))}
          </ul>
        </div>

        <div className="bg-green-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">หมายเหตุ</h2>
          <ul className="list-disc ml-6 mt-2">
            {mockData.notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">โซเชียลมีเดีย</h2>
          <ul className="list-disc ml-6 mt-2">
            <li><a href={mockData.socialMedia.facebook} className="text-blue-700 underline" target="_blank">Facebook</a></li>
            <li>Instagram: {mockData.socialMedia.instagram}</li>
            <li><a href={mockData.socialMedia.line} className="text-green-700 underline" target="_blank">Line</a></li>
            <li>Twitter: {mockData.socialMedia.twitter}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OpenHousePage;
