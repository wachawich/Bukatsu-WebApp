import { SubjectField } from "@/utils/api/subject";
import Image from "next/image";

interface SubjectCardProps {
  subject: SubjectField;
  selected?: boolean;
  onClick: () => void;
}

export default function SubjectCard({ subject, selected = false, onClick }: SubjectCardProps) {
  return (
    <div className="flex flex-col items-center text-center w-20 sm:w-28" onClick={onClick}>
      <div
        className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-sm cursor-pointer overflow-hidden transition
          ${selected
            ? 'border-2 bg-orange-500 text-white border-orange-500'
            : 'text-orange-500 border-orange-500 hover:bg-orange-100'}
        `}
      >
          {/* <Image
            src={subject.image_url?.banner || "/default-banner.jpg"}
            alt="Banner Subject Image"
            width={60}
            height={60}
            className="object-cover w-full h-full"
          /> */}
      </div>
      <div
        className={`text-xs sm:text-sm mt-2 transition ${
          selected ? 'text-orange-500 font-semibold' : 'text-orange-500'
        }`}
      >
        {subject.subject_name}
      </div>
    </div>
  );
}
