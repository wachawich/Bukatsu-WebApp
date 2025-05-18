import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LayoutShell from "@/comps/layouts/LayoutShell";
import FormPreview from '@/comps/form/form-builder/form-preview';
import { getActivity } from "@/utils/api/activity";
import { decodeToken } from '@/utils/auth/jwt';

function PageContent() {
    const router = useRouter();
    const { activity_id } = router.query;
    const [activity, setActivity] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
const userSysId = decodeToken()?.user_sys_id;

    useEffect(() => {
        const fetchActivity = async () => {
            if (!activity_id) return;
            const response = await getActivity({ activity_id: Number(activity_id) });
            setActivity(response.data[0] || null);
        };
        fetchActivity();
    }, [activity_id]);

    if (!activity) return <p>ไม่พบกิจกรรม</p>;

    return (
        <div className="bg-[#343434] w-full min-h-screen pt-14 overflow-auto p-40 mt-8">
           <div className='bg-white rounded-xl p-10'>
            {activity && activity.title && (
            <h1 className="text-2xl font-bold text-center mb-6 text-blue-900">{activity.title}</h1>
            )}
            
            <FormPreview
                form={activity.activity_json_form}
                user_sys_id={userSysId} 
                activity_id={activity_id as string}
                onSubmitSuccess={() => {
                    setIsSubmitted(true);  
                    router.push(`/activity_detail?activity_id=${activity_id}&submitted=true`); 
                }}
                />
            </div> 
        </div>
    );
}

export default function ActivityRegister() {
    return (
        <LayoutShell>
            <PageContent />
        </LayoutShell>
    );
}
