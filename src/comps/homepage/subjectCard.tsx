import { SubjectField } from "@/utils/api/subject";
import subjectIconMap from "@/comps/public/subjectIconMaping";
import { IconBook } from "@tabler/icons-react";
import { cloneElement } from "react";

interface SubjectCardProps {
  subject: SubjectField;
  selected?: boolean;
  onClick: () => void;
}

export default function SubjectCard({ subject, selected = false, onClick }: SubjectCardProps) {
  const iconSize = 32;
  const subjectIcon = subjectIconMap[subject.subject_id ?? ""];
  const iconColor = selected ?"#FFFFFF" :"#000000" ; 
  const strokeWidth = selected ? 2 : 0.75; 
  return (
    <div className="flex flex-col items-center text-center w-20 sm:w-28" onClick={onClick}>
      <div
        className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded cursor-pointer overflow-hidden transition
          ${selected
            ? 'border-2 bg-orange-500 border-orange-500'
            : 'border-2 border-orange-500 hover:bg-orange-100'}
        `}
      >
          {subjectIcon
          ? cloneElement(subjectIcon, { size: iconSize , color: iconColor , strokeWidth})
          : <IconBook size={iconSize} color={iconColor} strokeWidth={strokeWidth}/>}
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
