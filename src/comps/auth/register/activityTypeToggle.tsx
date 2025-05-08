import React, { useState } from 'react';
import { IconCheck } from '@tabler/icons-react';
import activityIconMap from '@/comps/public/activityIconMaping'; // เปลี่ยน subjectIconMap เป็น activityIconMap

interface ActivityType {
  activity_type_id: string;
  activity_type_name: string;
  show: boolean;
  flag_valid: boolean;
  // เพิ่ม property อื่นถ้าจำเป็น
}

interface SelectedActivityType {
  activity_type_id: string;
  activity_type_name: string;
  show: boolean;
  flag_valid: boolean;
}

interface ActivityCheckboxToggleProps {
  activities: ActivityType[];
  onSelectionChange: (selectedActivities: SelectedActivityType[]) => void;
}

const ActivityCheckboxToggle: React.FC<ActivityCheckboxToggleProps> = ({
  activities,
  onSelectionChange
}) => {
  const [selectedActivities, setSelectedActivities] = useState<SelectedActivityType[]>([]);

  const toggleActivity = (activity: ActivityType) => {
    let newSelectedActivities: any;

    const isSelected = selectedActivities.some(
      item => item.activity_type_id === activity.activity_type_id
    );

    if (isSelected) {
      newSelectedActivities = selectedActivities.filter(
        item => item.activity_type_id !== activity.activity_type_id
      );
    } else {
      newSelectedActivities = [
        ...selectedActivities,
        {
          activity_type_id: activity.activity_type_id,
          activity_type_name: activity.activity_type_name,
          show: activity.show,
          flag_valid: activity.flag_valid
        }
      ];
    }

    setSelectedActivities(newSelectedActivities);
    onSelectionChange(newSelectedActivities);
  };

  const isActivitySelected = (activityId: string) => {
    return selectedActivities.some(item => item.activity_type_id === activityId);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-1">
        {activities.map((activity) => (
          <div
            key={activity.activity_type_id}
            onClick={() => toggleActivity(activity)}
            className={`
              flex items-center justify-between gap-2 px-3 py-1 rounded-lg cursor-pointer border transition-all text-orange-400 bg-[#ffffff]
              ${isActivitySelected(activity.activity_type_id)
                ? 'border-orange-600 bg-[#ffffff]'
                : 'border-orange-200 hover:border-orange-300'}
            `}
          >
            {activityIconMap[activity.activity_type_id]}
            <span className="mx-0 my-0 text-xs">{activity.activity_type_name}</span>
            <div className="w-3">
              {isActivitySelected(activity.activity_type_id) && <IconCheck size={20} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityCheckboxToggle;
