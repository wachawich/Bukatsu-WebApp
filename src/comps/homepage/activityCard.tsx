import { ActivityField } from "@/utils/api/activity";

interface ActivityCardProps {
  activity: ActivityField;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const { title, description } = activity;

  return (
    <div className="flex border rounded-lg p-4 shadow hover:shadow-lg transition-all bg-white gap-4 w-full h-64">
      {/* 
      // TODO: Enable image when image field is ready in backend
      <img
        src={activity.image_url ?? 'test.png'}
        alt={title}
        className="w-48 h-full object-cover rounded-md"
      />*/}

      <div className="flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-lg font-semibold mb-1">{title}</h2>
          {/* 
      // Tag*/}
          <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
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
