import React from 'react'
import Link from 'next/link';

import LayoutShell from "@/comps/layouts/LayoutShell";

import ActivityDetail from "@/comps/activityDetail/activityDetail"

function PageContent() {
    // const [canRead, setCanRead] = useState(false);

    // useCheckTokenFlags(
    //     [{ flag: "read", onFlagUpdated: setCanRead }],
    //     "check_in"
    // );
    const activityId = 10;

    return (
        <div className="bg-[#343434] w-full h-full pt-14">
            <ActivityDetail/>
            <h1>รายการกิจกรรม</h1>
            <Link href={`/activity_detail/${activityId}`}>
  ดูรายละเอียดกิจกรรม
</Link>
        </div>
        // <>
        //     {canRead && (
        //         <div className="fadeIn-animation">
        //             {/* <CheckIn /> */}
        //         </div>
        //     )}
        // </>
    );
}


export default function ActivityDetails() {
    return (
        <>
            <LayoutShell>
                <PageContent></PageContent>
            </LayoutShell>
        </>
    );
}