import { useEffect, useState } from "react";
import { getSubject } from "@/utils/api/subject";

interface Subject {
  subject_id: string;
  subject_name: string;
  show: boolean;
}


export default function SubjectCard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subject = await getSubject({ show: true });
        setSubjects(subject.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div className="flex justify-center gap-5 flex-wrap ">
      {subjects.map((subject) => (
        <div key={subject.subject_id} className="text-center">
          <div className="w-20 h-20 border-2 border-orange-500 text-orange-500 flex items-center justify-center mx-2 mt-12 mb-2 rounded-sm hover:bg-orange-100 cursor-pointer transition ">
            Logo {/* image */}
          </div>
          <div className="text-orange-500 text-sm mb-12">
            {subject.subject_name}
          </div>
        </div>
      ))}
    </div>
  );
}
