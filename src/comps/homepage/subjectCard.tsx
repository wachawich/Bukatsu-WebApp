import { SubjectField } from "@/utils/api/subject";  // นำเข้า SubjectField

interface SubjectCardProps {
  subject: SubjectField;  // ใช้ SubjectField แทน Subject
}

export default function SubjectCard({ subject }: SubjectCardProps) {
  return (
    
    <div className="text-center">
      <div className="w-20 h-20 border-2 border-orange-500 text-orange-500 flex items-center justify-center mx-2 mt-12 mb-2 rounded-sm hover:bg-orange-100 cursor-pointer transition">
        Logo  {/* <img
               src={subject.image_url}
               alt={subject.title}
               /> */}
      </div>
      <div className="text-orange-500 text-sm mb-12">
        {subject.subject_name}
      </div>
    </div>
  );
}
