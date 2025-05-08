import { ActivityField } from "@/utils/api/activity";

interface ActivityCardProps {
  activity: ActivityField;  // กำหนดประเภท ActivityField ให้กับ prop
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <div className="flex border rounded-lg p-4 shadow hover:shadow-lg transition-all bg-white gap-4 w-full h-64">

      {/* <img
               src={activity.image_url}
              alt={activity.title}
              className="w-40 h-full object-cover rounded-md"
      /> */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-xl font-bold mb-1">{activity.title}</h2>
          {/* Tag: Subject name */}
          {/* <span className="inline-block bg-orange-100 text-orange-600 text-xs font-medium px-2 py-1 rounded mb-2">
            {activity.subject.name}
          </span> */}
          <p className="text-sm text-gray-600 line-clamp-3">
            {activity.description}
          </p>
        </div>
        <div className="mt-2 self-end">
          <button className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded">
            ดูเพิ่มเติม
          </button>
        </div>
      </div>
    </div>
  );
}


