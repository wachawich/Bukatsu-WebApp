import React from 'react'
import Link from 'next/link';
import LayoutShell from "@/comps/layouts/LayoutShell";
import AttendancePage from "@/comps/attendance/attendancePage"

function PageContent() {
    // const [canRead, setCanRead] = useState(false);

    // useCheckTokenFlags(
    //     [{ flag: "read", onFlagUpdated: setCanRead }],
    //     "check_in
    // );


    return (
        <div className="bg-white w-full min-h-screen pt-14 overflow-auto">
            <AttendancePage/>
            
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