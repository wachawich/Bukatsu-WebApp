// components/modals/ActivityRegisterModal.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import FormPreview from '@/comps/form/form-builder/form-preview';
import { getActivity } from "@/utils/api/activity";

interface Props {
  activityId: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ActivityRegisterModal({ activityId, onClose, onSuccess }: Props) {
  const router = useRouter();
  const [activity, setActivity] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!activityId) return;
      const response = await getActivity({ activity_id: Number(activityId) });
      setActivity(response.data[0] || null);
    };
    fetchActivity();
  }, [activityId]);

  if (!activity) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-2xl relative min-h-[30rem]">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl">✕</button>
        
        <h2 className="text-xl font-bold text-blue-900 mb-4 text-center">
          {activity.title || "Activity Form"}
        </h2>

        <FormPreview
          form={activity.activity_json_form}
          onSubmitSuccess={() => {
            setIsSubmitted(true);
            if (onSuccess) onSuccess();
            onClose();
            router.push(`/activity_detail?activity_id=${activityId}&submitted=true`);
          }}
        />
      </div>
    </div>
  );
}
