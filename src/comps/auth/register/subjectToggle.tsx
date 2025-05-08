import React, { useState, useEffect } from 'react';
import { IconCheck } from '@tabler/icons-react';
import subjectIconMap from '@/comps/public/subjectIconMaping'

interface Subject {
  subject_id: string;
  subject_name: string;
  show: boolean;
  flag_valid: boolean;
  // Add other properties as needed
}

interface SelectedSubject {
  subject_id: string;
  subject_name: string;
  show: boolean;
  flag_valid: boolean;
}

interface SubjectCheckboxToggleProps {
  subjects: Subject[];
  onSelectionChange: (selectedSubjects: SelectedSubject[]) => void;
}

const SubjectCheckboxToggle: React.FC<SubjectCheckboxToggleProps> = ({
  subjects,
  onSelectionChange
}) => {
  const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubject[]>([]);

  const toggleSubject = (subject: Subject) => {
    let newSelectedSubjects: any;

    // Check if subject is already selected
    const isSelected = selectedSubjects.some(
      item => item.subject_id === subject.subject_id
    );

    if (isSelected) {
      // Remove subject if already selected
      newSelectedSubjects = selectedSubjects.filter(
        item => item.subject_id !== subject.subject_id
      );
    } else {
      // Add subject if not selected
      newSelectedSubjects = [
        ...selectedSubjects,
        { subject_id: subject.subject_id, subject_name: subject.subject_name }
      ];
    }

    // Update local state
    setSelectedSubjects(newSelectedSubjects);

    // Send data back to parent component
    onSelectionChange(newSelectedSubjects);
  };

  const isSubjectSelected = (subjectId: string) => {
    return selectedSubjects.some(item => item.subject_id === subjectId);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-1">
        {subjects.map((subject) => (
          <div
            key={subject.subject_id}
            onClick={() => toggleSubject(subject)}
            className={`
              flex items-center justify-between gap-2 px-3 py-1 rounded-lg cursor-pointer border transition-all text-orange-400 bg-[#ffffff]
              ${isSubjectSelected(subject.subject_id)
                ? 'border-orange-600 bg-[#ffffff]'
                : 'border-orange-200 hover:border-orange-300'}
            `}
          >
            {subjectIconMap[subject.subject_id]}
            {/* <div className={`
              w-5 h-5 flex items-center justify-center rounded text-orange-800
              ${isSubjectSelected(subject.subject_id)
                ? 'bg-orange-500 text-white'
                : 'border border-orange-300'}
            `}>
              {isSubjectSelected(subject.subject_id) && <IconCheck size={16} />}
            </div> */}
            <span className="mx-0 my-0 text-sm">{subject.subject_name}</span>
            <div className="w-3">
              {isSubjectSelected(subject.subject_id) && <IconCheck size={20} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectCheckboxToggle;