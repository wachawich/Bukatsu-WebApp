import React from 'react'
import Link from 'next/link';
import LayoutShell from "@/comps/layouts/LayoutShell";
import ActivityDetail from "@/comps/activityDetail/activity_detailPage"
import Recommended from "@/comps/activityDetail/recommend";

function PageContent() {
    // const [canRead, setCanRead] = useState(false);

    // useCheckTokenFlags(
    //     [{ flag: "read", onFlagUpdated: setCanRead }],
    //     "check_in"
    // );


    return (
        <div className="bg-gray-100 w-full min-h-screen pt-14 overflow-auto">
            <ActivityDetail/>
            <div className='p-4 sm:p-6 max-w-6xl mx-auto'>
            <Recommended />
            </div>
          
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